// app/api/checkout/start/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceBySlug } from "@/lib/sanity";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

async function getPriceIdFromLookupKey(lookupKey) {
  if (!lookupKey) return null;

  // Find the currently active price tied to this lookup_key
  const prices = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
    expand: ["data.product"],
  });

  return prices?.data?.[0]?.id || null;
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const slug = form.get("slug");

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }

    const service = await getServiceBySlug(slug);

    if (!service) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }

    // Prefer lookupKey. Fallback to stripePriceId for backward compatibility.
    let priceId = null;

    if (service.lookupKey) {
      priceId = await getPriceIdFromLookupKey(service.lookupKey);
      if (!priceId) {
        return NextResponse.json(
          {
            error:
              "No active Stripe price found for this lookup key. Make sure the Price is active and has the same lookup_key.",
            lookupKey: service.lookupKey,
          },
          { status: 400 }
        );
      }
    } else if (service.stripePriceId) {
      priceId = service.stripePriceId;
    } else {
      return NextResponse.json(
        { error: "Service is missing lookupKey and stripePriceId." },
        { status: 400 }
      );
    }

    const stripeMode =
      service.stripeMode === "subscription" ? "subscription" : "payment";

    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";

    const successUrl = `${origin}/onboarding/${slug}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/services`;

    const session = await stripe.checkout.sessions.create({
      mode: stripeMode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,

      // Helpful metadata for debugging / fulfillment
      metadata: {
        serviceSlug: slug,
        serviceTitle: service.title || "",
        lookupKey: service.lookupKey || "",
      },
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("Checkout start error:", err);
    return NextResponse.json(
      { error: err?.message || "Checkout start failed." },
      { status: 500 }
    );
  }
}

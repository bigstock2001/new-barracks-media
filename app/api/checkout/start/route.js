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

  const prices = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
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

    // ✅ Use the field you actually have in Sanity
    const lookupKey = service.stripeLookupKey;

    if (!lookupKey) {
      return NextResponse.json(
        { error: "Service is missing stripeLookupKey." },
        { status: 400 }
      );
    }

    const priceId = await getPriceIdFromLookupKey(lookupKey);

    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "No active Stripe price found for this lookup key. Make sure the Price is active and has the same lookup_key.",
          lookupKey,
        },
        { status: 400 }
      );
    }

    const mode = service.stripeMode === "subscription" ? "subscription" : "payment";

    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";

    const successPath = service.successPath || `/onboarding/${slug}`;
    const successUrl = `${origin}${successPath}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/services`;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        serviceSlug: slug,
        serviceTitle: service.title || "",
        stripeLookupKey: lookupKey,
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

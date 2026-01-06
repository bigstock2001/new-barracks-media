import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceBySlug } from "@/lib/sanity";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function getBaseUrl(req) {
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  return `${proto}://${host}`;
}

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let slug = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      slug = body?.slug || "";
    } else {
      const form = await req.formData();
      slug = String(form.get("slug") || "");
    }

    slug = String(slug || "").trim();
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const service = await getServiceBySlug(slug);
    if (!service || service.active === false) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const priceId = String(service.stripePriceId || "").trim();
    if (!priceId) {
      return NextResponse.json({ error: "Missing stripePriceId in Sanity" }, { status: 400 });
    }

    const baseUrl = getBaseUrl(req);
    const successPath = service.successPath || `/onboarding/${service.slug}`;

    const session = await stripe.checkout.sessions.create({
      mode: service.stripeMode === "subscription" ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/services/${service.slug}?canceled=1`,
      metadata: {
        serviceSlug: service.slug,
        serviceTitle: service.title,
      },
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Checkout error" },
      { status: 500 }
    );
  }
}

// app/apply/page.jsx
import ApplyClient from "./ApplyClient";

export const metadata = {
  title: "Join the Network",
  description:
    "Apply to join the Barracks Media Network. Choose your partnership path and submit your show details for review.",
  alternates: { canonical: "/apply" },
  openGraph: {
    title: "Join the Network",
    description:
      "Apply to join the Barracks Media Network. Choose your partnership path and submit your show details for review.",
    url: "https://barracksmedia.com/apply",
    type: "website",
    siteName: "Barracks Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Network",
    description:
      "Apply to join the Barracks Media Network. Choose your partnership path and submit your show details for review.",
  },
};

export default function ApplyPage() {
  return <ApplyClient />;
}

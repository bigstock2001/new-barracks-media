// app/portal/page.jsx
import PortalClient from "./PortalClient";

export const metadata = {
  title: "Member Portal | Barracks Media",
  description: "Barracks Media member portal (login required).",
  alternates: { canonical: "/portal" },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function PortalPage() {
  return <PortalClient />;
}

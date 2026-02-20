import BookingTemplate from "@/components/BookingTemplate";

export const metadata = {
  title: "Book The Real Leadership Brief | Barracks Media",
  description:
    "Book a guest appearance on The Real Leadership Brief with Barracks Media.",
  alternates: { canonical: "/booking/the-real-leadership-brief" },
  openGraph: {
    title: "Book The Real Leadership Brief | Barracks Media",
    description:
      "Book a guest appearance on The Real Leadership Brief with Barracks Media.",
    url: "https://barracksmedia.com/booking/the-real-leadership-brief",
    type: "website",
    siteName: "Barracks Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book The Real Leadership Brief | Barracks Media",
    description:
      "Book a guest appearance on The Real Leadership Brief with Barracks Media.",
  },
};

export default function RealLeadershipBriefBookingPage() {
  return (
    <BookingTemplate
      showName="The Real Leadership Brief"
      showTagline="Straightforward conversations about leadership in the real world—business, discipline, responsibility, and building teams that perform."
      calendlyBaseUrl="https://calendly.com/donalddunn/the-real-leadership-brief"
    />
  );
}

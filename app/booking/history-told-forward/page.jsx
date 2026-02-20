import BookingTemplate from "@/components/BookingTemplate";

export const metadata = {
  title: "Book History Told Forward | Barracks Media",
  description:
    "Book a guest appearance on History Told Forward with Barracks Media.",
  alternates: { canonical: "/booking/history-told-forward" },
  openGraph: {
    title: "Book History Told Forward | Barracks Media",
    description:
      "Book a guest appearance on History Told Forward with Barracks Media.",
    url: "https://barracksmedia.com/booking/history-told-forward",
    type: "website",
    siteName: "Barracks Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book History Told Forward | Barracks Media",
    description:
      "Book a guest appearance on History Told Forward with Barracks Media.",
  },
};

export default function HistoryToldForwardBookingPage() {
  return (
    <BookingTemplate
      showName="History Told Forward"
      showTagline="Big stories, real context, and the lessons history keeps trying to teach us—told in a way that actually connects."
      calendlyBaseUrl="https://calendly.com/donalddunn/history-told-forward"
    />
  );
}

import BookingTemplate from "@/components/BookingTemplate";

export const metadata = {
  title: "Book Spirits and Stories with Donald Dunn | Barracks Media",
  description:
    "Book a guest appearance on Spirits and Stories with Donald Dunn.",
  alternates: { canonical: "/booking/spirits-and-stories" },
  openGraph: {
    title: "Book Spirits and Stories with Donald Dunn | Barracks Media",
    description:
      "Book a guest appearance on Spirits and Stories with Donald Dunn.",
    url: "https://barracksmedia.com/booking/spirits-and-stories",
    type: "website",
    siteName: "Barracks Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Spirits and Stories with Donald Dunn | Barracks Media",
    description:
      "Book a guest appearance on Spirits and Stories with Donald Dunn.",
  },
};

export default function SpiritsAndStoriesBookingPage() {
  return (
    <BookingTemplate
      showName="Spirits and Stories with Donald Dunn"
      showTagline="Authentic conversations with leaders, veterans, authors, and changemakers—exploring life, purpose, faith, and the stories that shape us."
      calendlyBaseUrl="https://calendly.com/donalddunn/spirits-and-stories-with-donald-dunn"
    />
  );
}

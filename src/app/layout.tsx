import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Samui Home Clinic Pharmacy",
    template: "%s | Samui Home Clinic Pharmacy",
  },
  description:
    "Koh Samui's premier online pharmacy. Order medications, health products and supplements for home delivery or click & collect.",
  keywords: ["pharmacy", "Koh Samui", "Thailand", "medication", "health", "delivery"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Samui Home Clinic Pharmacy",
    title: "Samui Home Clinic Pharmacy — Koh Samui's Online Pharmacy",
    description:
      "Order medications and health products online for delivery across Koh Samui.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-(--color-surface-secondary)">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card-hover)",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}

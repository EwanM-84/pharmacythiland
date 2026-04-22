import type { Metadata } from "next";
import { mockCategories, getBestSellers, getFeaturedProducts, getTrending, getCustomerFavorites, getStaffPicks, getSeasonalEssentials } from "@/lib/mock-products";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/store/CartDrawer";
import { HomePageContent } from "./HomePageContent";

export const metadata: Metadata = {
  title: "Samui Home Clinic Pharmacy | Licensed Online Pharmacy — Koh Samui",
  description: "Koh Samui's premier licensed online pharmacy. Same-day delivery of medications, vitamins and health products across Koh Samui, Thailand.",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <HomePageContent
          categories={mockCategories}
          bestSellers={getBestSellers(8)}
          featured={getFeaturedProducts(8)}
          trending={getTrending(8)}
          favorites={getCustomerFavorites(8)}
          staffPicks={getStaffPicks(8)}
          seasonal={getSeasonalEssentials(8)}
        />
      </main>
      <Footer />
    </>
  );
}

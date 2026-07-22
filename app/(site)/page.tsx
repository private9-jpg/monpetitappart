import { Hero } from "@/components/hero/Hero";
import { CategoriesSection } from "@/components/category/CategoriesSection";
import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Newsletter } from "@/components/newsletter/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeaturedArticles />
      <FeaturedProducts />
      <Newsletter />
    </>
  );
}

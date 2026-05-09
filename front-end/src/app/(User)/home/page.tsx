import Hero from "@/components/Hero";
import CookSection from "@/components/CookSection";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 px-10 max-md:px-6 py-16 max-md:py-12">
      <Hero />
      <CookSection />
    </div>
  );
}

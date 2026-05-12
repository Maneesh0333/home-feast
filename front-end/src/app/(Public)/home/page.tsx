"use client";

import Hero from "@/components/Hero";
import CookSection from "@/components/CookSection";
import { useRef } from "react";
import Footer from "@/components/user/Footer";
import AboutUs from "@/components/user/AboutUs";

export default function Home() {
  const sectionRef = useRef<HTMLElement | null>(null);
  return (
    <>
      <Hero scrollRef={sectionRef} />
      <CookSection scrollRef={sectionRef} />
      <AboutUs />
      <Footer />
    </>
  );
}

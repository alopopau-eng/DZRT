import { Navbar } from "@/components/layout/Navbar";
import { ProductGrid } from "@/components/home/ProductGrid";
import { InfoSection } from "@/components/home/InfoSection";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { useState } from "react";
import { FullPageLoader } from "@/components/Loader";
import { Init } from "@/components/init";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Init/>
        <Hero />
        <InfoSection />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}

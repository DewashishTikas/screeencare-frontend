import Footer from "./_components/Footer";
import HowItWorks from "./_components/HowItWorks";
import DeviceCompatibility from "./_components/DeviceCompatibility";
import ProductCategories from "./_components/ProductCategories";
import HeroSection from "./_components/HeroSection";
import ScrollVideoOverlay from "./_components/ScrollVideoOverlay";

export default function Home() {
  return (
    <main>
      <ScrollVideoOverlay>
        <HeroSection />
        <ProductCategories />
        <DeviceCompatibility />
        <HowItWorks />
        <Footer />
      </ScrollVideoOverlay>
    </main>
  );
}

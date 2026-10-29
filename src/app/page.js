import Footer from "./_components/Footer";
import HowItWorks from "./_components/HowItWorks";
import BookingSection from "./_components/BookingSection";
import HeroSection from "./_components/HeroSection";
import ScrollVideoOverlay from "./_components/ScrollVideoOverlay";

export default function Home() {
  return (
    <main>
      <ScrollVideoOverlay>
        <HeroSection />
        <BookingSection />
        <HowItWorks />
        <Footer />
      </ScrollVideoOverlay>
    </main>
  );
}

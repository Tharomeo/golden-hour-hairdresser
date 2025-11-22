import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <AboutSection />
      <ReviewsCarousel />
      <BookingSection />
      <Footer />
    </main>
  );
};

export default Index;

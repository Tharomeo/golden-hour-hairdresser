import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Import images
import hair1 from "@/assets/hair-1.jpg";
import salon1 from "@/assets/salon-1.jpg";
import hair2 from "@/assets/hair-2.jpg";
import tools1 from "@/assets/tools-1.jpg";
import hair3 from "@/assets/hair-3.jpg";
import hair4 from "@/assets/hair-4.jpg";
import products1 from "@/assets/products-1.jpg";
import hair5 from "@/assets/hair-5.jpg";

const Hero = () => {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const images = [hair1, salon1, hair2, tools1, hair3, hair4, products1, hair5];
  
  // Create multiple rows for continuous scroll
  const [imageRows, setImageRows] = useState([
    [...images, ...images],
    [...images, ...images].reverse(),
    [...images, ...images],
  ]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Animated Image Grid Background */}
      <div className="absolute inset-0">
        {imageRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-4 mb-4"
            style={{
              animation: `scroll-${rowIndex % 2 === 0 ? 'left' : 'right'} ${40 + rowIndex * 5}s linear infinite`,
            }}
          >
            {row.map((img, imgIndex) => (
              <div
                key={`${rowIndex}-${imgIndex}`}
                className="flex-shrink-0 w-64 h-64 relative overflow-hidden rounded-lg"
              >
                <img
                  src={img}
                  alt="Golden Hour Salon"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ))}
        
        {/* Subtle overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <motion.div 
          className="text-center max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="font-signature text-6xl md:text-8xl lg:text-9xl mb-6 text-gold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Golden Hour
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl mb-8 text-warm-white font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Sua melhor versão, revelada por especialistas
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              onClick={scrollToBooking}
              size="lg"
              className="bg-gold hover:bg-gold-dark text-foreground font-semibold text-lg px-10 py-7 rounded-full shadow-luxury transition-smooth hover:scale-105"
            >
              Agendar Minha Transformação
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </motion.div>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default Hero;

import { Star } from "lucide-react";

const ReviewsCarousel = () => {
  const reviews = [
    {
      name: "Mariana Santos",
      text: "Simplesmente perfeito! A atenção aos detalhes e o resultado final superaram todas as minhas expectativas.",
      rating: 5
    },
    {
      name: "Juliana Costa",
      text: "Profissionais incríveis, ambiente sofisticado e um resultado maravilhoso. Virei cliente fiel!",
      rating: 5
    },
    {
      name: "Rafaela Lima",
      text: "A melhor experiência em salão que já tive. Saí de lá me sentindo renovada e radiante.",
      rating: 5
    },
    {
      name: "Amanda Silva",
      text: "Recomendo de olhos fechados! Equipe super atenciosa e resultado impecável.",
      rating: 5
    },
    {
      name: "Camila Ferreira",
      text: "Transformação total! Adorei cada minuto no salão e o cuidado que tiveram comigo.",
      rating: 5
    },
    {
      name: "Beatriz Alves",
      text: "Luxo, conforto e profissionalismo em um só lugar. Não troco por nada!",
      rating: 5
    }
  ];

  // Duplicate reviews for seamless loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-24 bg-secondary/30 overflow-hidden">
      <div className="mb-12 text-center px-4">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-gold mb-4">
          O Que Nossas Clientes Dizem
        </h2>
        <p className="text-muted-foreground text-lg">
          Histórias reais de transformação e confiança
        </p>
      </div>

      <div className="relative">
        <div className="flex animate-scroll-left">
          {duplicatedReviews.map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[400px] mx-4"
            >
              <div className="bg-card p-8 rounded-2xl shadow-elegant border border-border/50 h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">
                  "{review.text}"
                </p>
                <p className="font-semibold text-gold">
                  {review.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsCarousel;

import { motion } from "framer-motion";
import { Sparkles, Award, Heart } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-gold" />,
      title: "Produtos Premium",
      description: "Trabalhamos exclusivamente com marcas de luxo reconhecidas mundialmente"
    },
    {
      icon: <Award className="w-8 h-8 text-gold" />,
      title: "Expertise Reconhecida",
      description: "Nossa equipe conta com profissionais premiados e certificados internacionalmente"
    },
    {
      icon: <Heart className="w-8 h-8 text-gold" />,
      title: "Experiência Única",
      description: "Cada visita é uma jornada de transformação e autocuidado personalizada"
    }
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-gold">
            Por que escolher o Golden Hour?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Não oferecemos apenas um serviço de cabelo - criamos uma experiência transformadora. 
            Cada cliente é único, e nossa missão é revelar sua beleza natural com técnicas 
            avançadas, produtos de altíssima qualidade e um cuidado genuíno com cada detalhe.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-2xl shadow-elegant hover:shadow-luxury transition-smooth border border-border/50"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-display text-2xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

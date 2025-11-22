import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl font-bold text-gold mb-4">
              Atelier Lumière
            </h3>
            <p className="text-background/80 leading-relaxed">
              Onde beleza e sofisticação se encontram para revelar sua melhor versão.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold">Contato</h4>
            <div className="space-y-3 text-background/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-gold" />
                <span>Av. Paulista, 1000 - São Paulo, SP</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-gold" />
                <span>(11) 3000-0000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-gold" />
                <span>contato@atelierlumiere.com.br</span>
              </div>
            </div>
          </div>

          {/* Hours & Social */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold">Horários</h4>
            <div className="text-background/80 mb-6">
              <p>Segunda a Sexta: 9h às 20h</p>
              <p>Sábado: 9h às 18h</p>
              <p>Domingo: Fechado</p>
            </div>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-background/60 text-sm">
          <p>&copy; 2024 Atelier Lumière. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

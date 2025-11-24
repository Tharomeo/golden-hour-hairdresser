import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Scissors, Sparkles, Heart, Crown, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Wand2, Phone, Mail, MapPin, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Step = 1 | 2 | 3 | 4;

interface Service {
  id: string;
  name: string;
  icon: any;
  duration: number;
  price: string;
  description: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookingSection = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [showCustomizeCard, setShowCustomizeCard] = useState(false);

  const services: Service[] = [
    {
      id: "corte-finalizacao",
      name: "Corte & Finalização",
      icon: Scissors,
      duration: 60,
      price: "R$ 150",
      description: "Corte moderno com finalização profissional"
    },
    {
      id: "coloracao",
      name: "Coloração Completa",
      icon: Sparkles,
      duration: 120,
      price: "R$ 350",
      description: "Coloração completa com produtos premium"
    },
    {
      id: "mechas-tratamento",
      name: "Mechas & Tratamento",
      icon: Crown,
      duration: 180,
      price: "R$ 450",
      description: "Mechas + tratamento de reconstrução"
    },
    {
      id: "hidratacao-premium",
      name: "Hidratação Premium",
      icon: Heart,
      duration: 90,
      price: "R$ 200",
      description: "Tratamento profundo de hidratação"
    },
  ];

  const timeSlots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: false },
    { time: "13:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: true },
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedDate !== undefined;
      case 3:
        return selectedTime !== "";
      case 4:
        return clientName !== "" && clientEmail !== "" && clientPhone !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    try {
      const formattedDate = format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      
      // Send WhatsApp message
      const whatsappMessage = encodeURIComponent(
        `✨ *Confirmação de Agendamento* ✨\n\n` +
        `Olá ${clientName}!\n\n` +
        `Seu agendamento foi confirmado:\n\n` +
        `📋 *Serviço:* ${selectedService.name}\n` +
        `📅 *Data:* ${formattedDate}\n` +
        `🕐 *Horário:* ${selectedTime}\n` +
        `💰 *Valor:* ${selectedService.price}\n\n` +
        `📍 *Endereço:*\n` +
        `Rua das Flores, 123 - Jardins, São Paulo\n\n` +
        `Por favor, chegue com 10 minutos de antecedência.\n\n` +
        `Qualquer dúvida, estamos à disposição! 💕`
      );
      
      const whatsappNumber = clientPhone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${whatsappMessage}`;
      
      // Open WhatsApp in a new window
      window.open(whatsappUrl, '_blank');
      
      toast.success("Agendamento confirmado! Você receberá uma mensagem no WhatsApp.");
      
      // Reset form
      setCurrentStep(1);
      setSelectedService(null);
      setSelectedDate(undefined);
      setSelectedTime("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error("Erro ao confirmar agendamento. Tente novamente.");
    }
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <section id="booking" className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-gold">
            Reserve Seu Horário
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Escolha o serviço, data e horário perfeitos para sua transformação
          </p>
        </motion.div>

        {/* Progress Stepper - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex justify-center items-center mb-12 gap-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  step <= currentStep
                    ? "bg-gold border-gold text-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {step < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{step}</span>
                )}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-0.5 transition-colors ${
                    step < currentStep ? "bg-gold" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-card p-6 md:p-12 rounded-3xl shadow-luxury border border-border/50 min-h-[500px] md:min-h-[600px] flex flex-col"
        >
          {/* Mobile Step Indicator */}
          <div className="md:hidden flex justify-between items-center mb-6 pb-4 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">
              Passo {currentStep} de 4
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step === currentStep ? "bg-gold" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={currentStep}>
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {/* Step 1: Select Service */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center md:text-left mb-6">
                      <h3 className="text-xl md:text-2xl font-display font-bold mb-2">
                        Escolha seu Serviço
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base">
                        Selecione o procedimento desejado
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      {services.map((service) => {
                        const Icon = service.icon;
                        const isSelected = selectedService?.id === service.id;
                        
                        return (
                          <button
                            key={service.id}
                            onClick={() => setSelectedService(service)}
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                              isSelected
                                ? "border-gold bg-gold/5 shadow-luxury"
                                : "border-border bg-card hover:border-gold/50 hover:shadow-elegant"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                                <Check className="w-4 h-4 text-foreground" />
                              </div>
                            )}
                            
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                              isSelected ? "bg-gold" : "bg-secondary"
                            }`}>
                              <Icon className={`w-6 h-6 ${isSelected ? "text-foreground" : "text-gold"}`} />
                            </div>
                            
                            <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gold font-bold text-lg">{service.price}</span>
                              <span className="text-muted-foreground">{service.duration} min</span>
                            </div>
                          </button>
                        );
                      })}
                      
                      {/* Customize Option */}
                      <button
                        onClick={() => setShowCustomizeCard(true)}
                        className="relative p-6 rounded-2xl border-2 border-dashed border-gold/50 bg-card transition-all duration-300 text-left hover:border-gold hover:bg-gold/5 hover:shadow-elegant"
                      >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-gold/10">
                          <Wand2 className="w-6 h-6 text-gold" />
                        </div>
                        
                        <h4 className="font-semibold text-lg mb-2">Personalizar</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Precisa de algo especial? Entre em contato
                        </p>
                        
                        <div className="text-gold text-sm font-medium">
                          Ver informações →
                        </div>
                      </button>
                    </div>

                    {/* Customize Contact Card Modal */}
                    <AnimatePresence>
                      {showCustomizeCard && (
                        <>
                          {/* Backdrop */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCustomizeCard(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                          />
                          
                          {/* Modal Card */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-card rounded-3xl shadow-luxury border-2 border-gold/30 z-50 overflow-hidden"
                          >
                            {/* Close Button */}
                            <button
                              onClick={() => setShowCustomizeCard(false)}
                              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 hover:bg-background flex items-center justify-center transition-colors z-10"
                            >
                              <X className="w-5 h-5" />
                            </button>

                            {/* Header with gradient */}
                            <div className="bg-gradient-to-br from-gold via-gold-light to-gold-dark p-8 text-foreground">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  <Wand2 className="w-7 h-7" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-display font-bold">Personalizar Serviço</h3>
                                  <p className="text-sm opacity-90">Estamos aqui para você!</p>
                                </div>
                              </div>
                              
                              <p className="text-base leading-relaxed">
                                Bem-vindo! Queremos criar uma experiência única para você. Entre em contato conosco para personalizar seu atendimento.
                              </p>
                            </div>

                            {/* Contact Information */}
                            <div className="p-8 space-y-6">
                              <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                                  <Phone className="w-6 h-6 text-gold" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1">Telefone</h4>
                                  <a href="tel:+5511999999999" className="text-muted-foreground hover:text-gold transition-colors">
                                    (11) 99999-9999
                                  </a>
                                </div>
                              </div>

                              <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                                  <Mail className="w-6 h-6 text-gold" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1">E-mail</h4>
                                  <a href="mailto:contato@salao.com" className="text-muted-foreground hover:text-gold transition-colors">
                                    contato@salao.com
                                  </a>
                                </div>
                              </div>

                              <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                                  <MapPin className="w-6 h-6 text-gold" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1">Endereço</h4>
                                  <p className="text-muted-foreground">
                                    Rua das Flores, 123<br />
                                    Jardins - São Paulo, SP<br />
                                    CEP: 01234-567
                                  </p>
                                </div>
                              </div>

                              <div className="pt-4">
                                <Button
                                  onClick={() => setShowCustomizeCard(false)}
                                  className="w-full h-12 bg-gold hover:bg-gold-dark text-foreground font-semibold"
                                >
                                  Entendi, obrigado!
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Step 2: Select Date */}
                {currentStep === 2 && (
                  <div className="space-y-6 flex flex-col items-center">
                    <div className="text-center mb-6">
                      <h3 className="text-xl md:text-2xl font-display font-bold mb-2">
                        Escolha a Data
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base">
                        Selecione o dia do seu atendimento
                      </p>
                    </div>
                    
                    <div className="w-full max-w-md flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="rounded-2xl border-2 border-border shadow-elegant bg-card pointer-events-auto"
                        locale={ptBR}
                      />
                    </div>
                    
                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/50 px-4 py-3 rounded-lg"
                      >
                        <CalendarIcon className="w-4 h-4 text-gold" />
                        <span>
                          Data selecionada: {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Step 3: Select Time */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center md:text-left mb-6">
                      <h3 className="text-xl md:text-2xl font-display font-bold mb-2">
                        Escolha o Horário
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base">
                        Selecione o melhor horário para você
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                      {timeSlots.map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        
                        return (
                          <motion.button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            whileHover={slot.available ? { scale: 1.05 } : {}}
                            whileTap={slot.available ? { scale: 0.95 } : {}}
                            className={`relative p-4 md:p-6 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "border-gold bg-gold text-foreground shadow-luxury"
                                : slot.available
                                ? "border-border hover:border-gold/50 bg-card"
                                : "border-border bg-muted/30 opacity-50 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Clock className={`w-5 h-5 ${isSelected ? "text-foreground" : "text-gold"}`} />
                              <span className={`font-semibold text-base md:text-lg ${
                                !slot.available && !isSelected ? "text-muted-foreground" : ""
                              }`}>
                                {slot.time}
                              </span>
                            </div>
                            
                            {!slot.available && (
                              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                                <span className="text-xs font-medium text-muted-foreground">Indisponível</span>
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4: Client Information */}
                {currentStep === 4 && (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="text-center mb-6">
                      <h3 className="text-xl md:text-2xl font-display font-bold mb-2">
                        Seus Dados
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base">
                        Finalize seu agendamento
                      </p>
                    </div>
                    
                    {/* Booking Summary */}
                    <div className="bg-secondary/30 border border-border rounded-2xl p-6 space-y-4">
                      <h4 className="font-semibold text-lg mb-4">Resumo do Agendamento</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Scissors className="w-5 h-5 text-gold mt-0.5" />
                          <div>
                            <p className="font-medium">{selectedService?.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedService?.duration} minutos</p>
                          </div>
                          <span className="ml-auto font-bold text-gold">{selectedService?.price}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="w-5 h-5 text-gold" />
                          <p className="text-sm">
                            {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gold" />
                          <p className="text-sm">{selectedTime}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-base">Nome Completo</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Maria Silva"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="mt-2 h-12"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-base">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="maria@email.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="mt-2 h-12"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-base">Telefone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="mt-2 h-12"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons - Fixed at bottom on mobile */}
          <div className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-border">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              variant="outline"
              className="flex-1 md:flex-none md:min-w-[140px] h-12 md:h-14"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 md:flex-none md:min-w-[140px] h-12 md:h-14 bg-gold hover:bg-gold-dark text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleConfirmBooking}
                disabled={!canProceed()}
                className="flex-1 md:flex-none md:min-w-[180px] h-12 md:h-14 bg-gold hover:bg-gold-dark text-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Agendamento
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingSection;

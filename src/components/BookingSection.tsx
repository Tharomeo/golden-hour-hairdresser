import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSlot {
  time: string;
  available: boolean;
}

const BookingSection = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const services = [
    { id: "corte-finalizacao", name: "Corte & Finalização", duration: 60 },
    { id: "coloracao", name: "Coloração Completa", duration: 120 },
    { id: "mechas-tratamento", name: "Mechas & Tratamento", duration: 180 },
    { id: "hidratacao-premium", name: "Hidratação Premium", duration: 90 },
    { id: "penteado-evento", name: "Penteado para Evento", duration: 90 },
  ];

  const handleServiceChange = (value: string) => {
    console.log("Serviço selecionado:", value);
    setSelectedService(value);
    setSelectedDate(undefined);
    setSelectedTime("");
    setAvailableSlots([]);
  };

  const fetchAvailableSlots = async (date: Date, serviceId: string) => {
    if (!webhookUrl) {
      toast.error("Por favor, configure o webhook URL do n8n primeiro");
      return;
    }

    setIsLoadingSlots(true);
    const service = services.find(s => s.id === serviceId);
    
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "get_available_slots",
          data_selecionada: date.toISOString().split('T')[0],
          servico_id: serviceId,
          duracao_minutos: service?.duration || 60,
        }),
      });

      if (!response.ok) throw new Error("Erro ao buscar horários");

      const data = await response.json();
      setAvailableSlots(data.slots || []);
      
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao carregar horários disponíveis");
      // Mock data for demonstration
      setAvailableSlots([
        { time: "09:00", available: true },
        { time: "10:00", available: true },
        { time: "11:00", available: false },
        { time: "14:00", available: true },
        { time: "15:00", available: true },
        { time: "16:00", available: true },
      ]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (date && selectedService) {
      fetchAvailableSlots(date, selectedService);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientEmail || !clientPhone) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!webhookUrl) {
      toast.error("Por favor, configure o webhook URL do n8n primeiro");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "confirm_booking",
          servico_id: selectedService,
          data: selectedDate.toISOString().split('T')[0],
          horario: selectedTime,
          cliente: {
            nome: clientName,
            email: clientEmail,
            telefone: clientPhone,
          },
        }),
      });

      if (!response.ok) throw new Error("Erro ao confirmar agendamento");

      toast.success("Agendamento confirmado! Você receberá um email de confirmação.");
      
      // Reset form
      setSelectedService("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setAvailableSlots([]);
      
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao confirmar agendamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gold">
            Reserve Seu Horário
          </h2>
          <p className="text-muted-foreground text-lg">
            Escolha o serviço, data e horário perfeitos para sua transformação
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-card p-8 md:p-12 rounded-3xl shadow-luxury border border-border/50"
        >
          {/* Webhook Configuration (For Development) */}
          <div className="mb-8 p-4 bg-muted/50 rounded-lg">
            <Label htmlFor="webhook" className="text-sm font-medium mb-2 block">
              N8N Webhook URL (Configure seu endpoint)
            </Label>
            <Input
              id="webhook"
              type="url"
              placeholder="https://seu-n8n.app/webhook/booking"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {/* Step 1: Service Selection */}
          <div className="mb-8">
            <Label htmlFor="service" className="text-lg font-semibold mb-3 block">
              1. Escolha seu Serviço
            </Label>
            <Select value={selectedService} onValueChange={handleServiceChange}>
              <SelectTrigger id="service" className="h-14 text-base">
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-card">
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} ({service.duration} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Date Selection */}
          {selectedService && (
            <div className="mb-8">
              <Label className="text-lg font-semibold mb-3 block">
                2. Escolha a Data
              </Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border shadow-elegant"
                />
              </div>
            </div>
          )}

          {/* Step 3: Time Selection */}
          {selectedDate && (
            <div className="mb-8">
              <Label className="text-lg font-semibold mb-3 block">
                3. Escolha o Horário
              </Label>
              {isLoadingSlots ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-gold" />
                  <span className="ml-3 text-muted-foreground">Carregando horários...</span>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`h-12 ${
                        selectedTime === slot.time
                          ? "bg-gold hover:bg-gold-dark text-foreground"
                          : ""
                      }`}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Client Information */}
          {selectedTime && (
            <div className="space-y-6">
              <Label className="text-lg font-semibold block">
                4. Seus Dados
              </Label>
              
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Maria Silva"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="maria@email.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="w-full h-14 bg-gold hover:bg-gold-dark text-foreground font-semibold text-lg shadow-luxury transition-smooth"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Confirmando...
                  </>
                ) : (
                  "Confirmar Agendamento"
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BookingSection;

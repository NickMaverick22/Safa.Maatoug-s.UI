import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';
import { addAppointment, getAppointments } from '../lib/cms-storage';
import { toast } from '../components/ui/sonner';
import { Appointment } from '../types/cms';
import 'react-day-picker/dist/style.css';

const BookAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [step, setStep] = useState<'datetime' | 'form'>('datetime');
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: 'consultation' as 'consultation' | 'fitting' | 'final-fitting' | 'delivery',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  // Available time slots (admin configurable in real implementation)
  const availableTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const services = [
    { value: 'consultation', label: 'Consultation initiale' },
    { value: 'fitting', label: 'Essayage' },
    { value: 'final-fitting', label: 'Essayage final' },
    { value: 'delivery', label: 'Livraison' }
  ];

  useEffect(() => {
    loadExistingAppointments();
  }, []);

  const loadExistingAppointments = async () => {
    try {
      const appointments = await getAppointments();
      setExistingAppointments(appointments.filter(apt => 
        apt.status === 'scheduled' || apt.status === 'confirmed'
      ));
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const getAvailableTimeSlotsForDate = (date: Date): string[] => {
    if (!date) return [];

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Get booked slots for the selected date
    const bookedSlots = existingAppointments
      .filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate.toDateString() === date.toDateString();
      })
      .map(apt => apt.appointmentTime);

    return availableTimeSlots.filter(timeSlot => {
      // Remove already booked slots
      if (bookedSlots.includes(timeSlot)) {
        return false;
      }

      // If it's today, only show slots that are at least 1 hour from now
      if (isToday) {
        const [hours, minutes] = timeSlot.split(':').map(Number);
        const slotTime = hours * 60 + minutes;
        const currentTime = currentHour * 60 + currentMinute;
        
        // Must be at least 60 minutes from current time
        return slotTime >= currentTime + 60;
      }

      return true;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeConfirm = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Veuillez sélectionner une date et un créneau horaire');
      return;
    }
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error('Veuillez sélectionner une date et un créneau horaire');
      return;
    }

    setIsSubmitting(true);

    try {
      const appointment = await addAppointment({
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        service: formData.service,
        status: 'scheduled',
        notes: formData.notes
      });

      if (appointment) {
        toast.success('Votre rendez-vous a été réservé avec succès !');
        setTimeout(() => {
          navigate('/contact');
        }, 2000);
      } else {
        toast.error('Erreur lors de la réservation. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable past dates and Sundays
  const disabledDays = [
    { before: new Date() },
    { dayOfWeek: [0] } // Sunday
  ];

  const availableTimeSlotsForSelectedDate = selectedDate ? getAvailableTimeSlotsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <LuxuryAnimations />
      
      {/* Simplified Header Section */}
      <section className="pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="fade-slide-up font-serif text-5xl md:text-6xl text-navy mb-8">
            Réservez votre rendez-vous
          </h1>
          <div className="animated-separator mx-auto"></div>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className={`flex items-center space-x-2 ${step === 'datetime' ? 'text-navy' : 'text-champagne'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold ${
                step === 'datetime' ? 'bg-navy text-ivory' : 'bg-champagne text-navy'
              }`}>
                1
              </div>
              <span className="font-sans font-medium">Date & Heure</span>
            </div>
            
            <div className={`w-12 h-0.5 ${step === 'form' ? 'bg-champagne' : 'bg-navy/20'}`}></div>
            
            <div className={`flex items-center space-x-2 ${step === 'form' ? 'text-navy' : 'text-navy/40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold ${
                step === 'form' ? 'bg-navy text-ivory' : 'bg-navy/20 text-navy/40'
              }`}>
                2
              </div>
              <span className="font-sans font-medium">Vos informations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Date & Time Selection */}
      {step === 'datetime' && (
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar Section */}
              <div className="lg:col-span-2 bg-soft-beige rounded-2xl p-6 md:p-8">
                <h3 className="font-serif text-2xl text-navy mb-6 text-center">
                  Choisissez une date
                </h3>
                <div className="flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={disabledDays}
                    className="rdp-custom"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-lg font-serif font-semibold text-navy",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-8 w-8 bg-ivory hover:bg-champagne rounded-lg transition-colors duration-200 flex items-center justify-center",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-navy/60 rounded-md w-10 font-sans font-medium text-sm",
                      row: "flex w-full mt-2",
                      cell: "h-10 w-10 text-center text-sm p-0 relative",
                      day: "h-10 w-10 p-0 font-sans text-navy hover:bg-champagne hover:text-navy rounded-lg transition-colors duration-200 flex items-center justify-center",
                      day_selected: "bg-navy text-white hover:bg-navy hover:text-white",
                      day_today: "bg-champagne/20 text-navy font-semibold",
                      day_outside: "text-navy/30",
                      day_disabled: "text-navy/20 cursor-not-allowed hover:bg-transparent"
                    }}
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="bg-soft-beige rounded-2xl p-6 md:p-8">
                <h3 className="font-serif text-2xl text-navy mb-6 text-center">
                  Créneaux disponibles
                </h3>
                
                {!selectedDate ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <svg className="w-12 h-12 mx-auto text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="font-sans text-navy/60">
                      Sélectionnez d'abord une date
                    </p>
                  </div>
                ) : availableTimeSlotsForSelectedDate.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <svg className="w-12 h-12 mx-auto text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="font-sans text-navy/60 text-center">
                      Aucun créneau disponible pour cette date
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableTimeSlotsForSelectedDate.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`w-full py-3 px-4 rounded-lg font-sans text-sm font-medium transition-colors duration-200 ${
                          selectedTime === time
                            ? 'bg-navy text-white'
                            : 'bg-ivory text-navy hover:bg-champagne'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="mt-8 pt-6 border-t border-champagne/20">
                    <div className="bg-ivory rounded-lg p-4 mb-4">
                      <h4 className="font-sans font-semibold text-navy mb-2">Récapitulatif</h4>
                      <p className="font-sans text-sm text-navy/70">
                        <strong>Date:</strong> {selectedDate.toLocaleDateString('fr-FR')}
                      </p>
                      <p className="font-sans text-sm text-navy/70">
                        <strong>Heure:</strong> {selectedTime}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleDateTimeConfirm}
                      className="w-full bg-navy text-ivory py-3 rounded-lg font-sans font-medium hover:bg-champagne hover:text-navy transition-colors duration-200"
                    >
                      Continuer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Form Section */}
      {step === 'form' && (
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-soft-beige rounded-2xl p-6 md:p-8">
              {/* Selected Date/Time Summary */}
              <div className="bg-ivory rounded-lg p-4 mb-8">
                <h3 className="font-serif text-xl text-navy mb-3">Votre rendez-vous</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-navy">
                      <strong>{selectedDate?.toLocaleDateString('fr-FR')}</strong> à <strong>{selectedTime}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setStep('datetime')}
                    className="text-champagne hover:text-gold font-sans text-sm font-medium"
                  >
                    Modifier
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="clientName" className="block font-sans text-sm font-medium text-navy mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="clientName"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans"
                      placeholder="Marie Dupont"
                    />
                  </div>

                  <div>
                    <label htmlFor="clientEmail" className="block font-sans text-sm font-medium text-navy mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="clientEmail"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans"
                      placeholder="marie@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="clientPhone" className="block font-sans text-sm font-medium text-navy mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="clientPhone"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block font-sans text-sm font-medium text-navy mb-2">
                    Type de service *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans"
                  >
                    {services.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="block font-sans text-sm font-medium text-navy mb-2">
                    Notes (optionnel)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans resize-none"
                    placeholder="Informations supplémentaires..."
                  />
                </div>

                {/* Submit Section */}
                <div className="bg-ivory rounded-lg p-6 text-center">
                  <div className="mb-6">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <svg className="w-6 h-6 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-sans text-navy font-medium">Consultation gratuite et sans engagement</span>
                    </div>
                    <p className="font-sans text-sm text-navy/70">
                      Vous recevrez une confirmation par email dans les 24 heures
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      type="button"
                      onClick={() => setStep('datetime')}
                      className="px-8 py-3 bg-ivory text-navy rounded-lg font-sans font-medium border-2 border-navy hover:bg-soft-beige transition-colors duration-200"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-navy text-ivory rounded-lg font-sans font-medium hover:bg-champagne hover:text-navy transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Réservation en cours...' : 'Confirmer le rendez-vous'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BookAppointment;
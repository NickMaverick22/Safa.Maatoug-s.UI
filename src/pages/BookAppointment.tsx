import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LuxuryAnimations from '../components/LuxuryAnimations';
import { addAppointment } from '../lib/cms-storage';
import { toast } from '../components/ui/sonner';
import 'react-day-picker/dist/style.css';

const BookAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    appointmentTime: '',
    service: 'consultation' as 'consultation' | 'fitting' | 'final-fitting' | 'delivery',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const services = [
    { value: 'consultation', label: 'Consultation initiale' },
    { value: 'fitting', label: 'Essayage' },
    { value: 'final-fitting', label: 'Essayage final' },
    { value: 'delivery', label: 'Livraison' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast.error('Veuillez sélectionner une date');
      return;
    }

    if (!formData.appointmentTime) {
      toast.error('Veuillez sélectionner un créneau horaire');
      return;
    }

    setIsSubmitting(true);

    try {
      const appointment = await addAppointment({
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        appointmentDate: selectedDate,
        appointmentTime: formData.appointmentTime,
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

  return (
    <div className="min-h-screen bg-ivory">
      <Navigation />
      <LuxuryAnimations />
      
      {/* Header Section */}
      <section className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative mb-12">
            {/* Large background text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <span className="font-serif text-6xl md:text-[8rem] lg:text-[10rem] text-champagne/5 font-bold select-none">
                Rendez-vous
              </span>
            </div>
            
            {/* Main content */}
            <div className="relative z-10">
              <h1 className="fade-slide-up font-serif text-5xl md:text-6xl text-navy mb-8">
                Réservez votre rendez-vous
              </h1>
              <div className="animated-separator mx-auto"></div>
              
              <p className="fade-slide-up font-sans text-xl text-navy/70 leading-relaxed max-w-3xl mx-auto mt-8">
                Choisissez la date et l'heure qui vous conviennent pour votre consultation. 
                Nous avons hâte de vous rencontrer et de créer ensemble votre robe de rêve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calendar Section */}
              <div className="bg-soft-beige rounded-2xl p-6 md:p-8">
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
                      day_selected: "bg-navy text-ivory hover:bg-navy hover:text-ivory",
                      day_today: "bg-champagne/20 text-navy font-semibold",
                      day_outside: "text-navy/30",
                      day_disabled: "text-navy/20 cursor-not-allowed hover:bg-transparent"
                    }}
                  />
                </div>
              </div>

              {/* Form Section */}
              <div className="bg-soft-beige rounded-2xl p-6 md:p-8">
                <h3 className="font-serif text-2xl text-navy mb-6">
                  Vos informations
                </h3>
                
                <div className="space-y-4">
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
                </div>
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="bg-soft-beige rounded-2xl p-6 md:p-8">
                <h3 className="font-serif text-2xl text-navy mb-6 text-center">
                  Choisissez un créneau horaire
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, appointmentTime: time }))}
                      className={`py-3 px-4 rounded-lg font-sans text-sm font-medium transition-colors duration-200 ${
                        formData.appointmentTime === time
                          ? 'bg-navy text-ivory'
                          : 'bg-ivory text-navy hover:bg-champagne'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Section */}
            <div className="bg-soft-beige rounded-2xl p-6 md:p-8 text-center">
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
                  onClick={() => navigate('/contact')}
                  className="px-8 py-3 bg-ivory text-navy rounded-lg font-sans font-medium border-2 border-navy hover:bg-soft-beige transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedDate || !formData.appointmentTime}
                  className="px-8 py-3 bg-navy text-ivory rounded-lg font-sans font-medium hover:bg-champagne hover:text-navy transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Réservation en cours...' : 'Confirmer le rendez-vous'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookAppointment;
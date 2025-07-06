import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout';
import { getTestimonials, deleteTestimonial } from '../../lib/cms-storage';
import { getCurrentUser } from '../../lib/auth';
import { Testimonial } from '../../types/cms';
import { toast } from '../../components/ui/sonner';

const CMSTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const user = getCurrentUser();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast.error('Erreur lors du chargement des témoignages');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      try {
        const success = await deleteTestimonial(id);
        if (success) {
          loadTestimonials();
          toast.success('Témoignage supprimé');
          setSelectedTestimonial(null);
        } else {
          toast.error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-4xl text-navy mb-2">Témoignages</h1>
          <p className="font-sans text-navy/70">Gérez les avis de vos clients</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-ivory rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedTestimonial(testimonial)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-serif text-lg text-navy font-semibold">
                    {testimonial.name}
                  </h3>
                  <p className="font-sans text-sm text-navy/60">
                    {new Date(testimonial.submittedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              
              <blockquote className="font-serif text-navy italic mb-4 line-clamp-3">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex justify-between items-center text-xs text-navy/60 font-sans">
                <span>Soumis le {new Date(testimonial.submittedAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="font-serif text-xl text-navy mb-2">Aucun témoignage</h3>
            <p className="font-sans text-navy/60">
              Aucun témoignage pour le moment
            </p>
          </div>
        )}
      </div>

      {/* Testimonial Detail Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-ivory rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-serif text-2xl text-navy font-semibold mb-2">
                    {selectedTestimonial.name}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="font-sans text-navy/70">
                      Soumis le {new Date(selectedTestimonial.submittedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="text-navy/60 hover:text-navy text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-sans font-semibold text-navy mb-2">Témoignage</h3>
                  <blockquote className="font-serif text-lg text-navy italic bg-soft-beige p-4 rounded-lg">
                    "{selectedTestimonial.quote}"
                  </blockquote>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-sans font-semibold text-navy">Soumis le:</span>
                    <p className="font-sans text-navy/70">
                      {new Date(selectedTestimonial.submittedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-champagne/20">
                  <button
                    onClick={() => handleDelete(selectedTestimonial.id)}
                    className="w-full bg-red-100 text-red-700 py-3 rounded-lg font-sans font-medium hover:bg-red-200 transition-colors duration-200"
                  >
                    Supprimer définitivement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </CMSLayout>
  );
};

export default CMSTestimonials;
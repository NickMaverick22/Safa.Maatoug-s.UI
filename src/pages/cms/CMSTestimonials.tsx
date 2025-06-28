import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout';
import { getTestimonials, updateTestimonialStatus, deleteTestimonial } from '../../lib/cms-storage';
import { getCurrentUser } from '../../lib/auth';
import { Testimonial } from '../../types/cms';
import { toast } from '../../components/ui/sonner';

const CMSTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const user = getCurrentUser();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = () => {
    setTestimonials(getTestimonials());
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
    if (!user) return;
    
    const success = updateTestimonialStatus(id, status, user.email);
    if (success) {
      loadTestimonials();
      toast.success(`Témoignage ${status === 'approved' ? 'approuvé' : 'rejeté'}`);
      setSelectedTestimonial(null);
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      const success = deleteTestimonial(id);
      if (success) {
        loadTestimonials();
        toast.success('Témoignage supprimé');
        setSelectedTestimonial(null);
      } else {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-serif text-4xl text-navy mb-2">Témoignages</h1>
            <p className="font-sans text-navy/70">Gérez les avis de vos clients</p>
          </div>
          
          {/* Filter */}
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'pending', label: 'En attente' },
              { key: 'approved', label: 'Approuvés' },
              { key: 'rejected', label: 'Rejetés' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-4 py-2 rounded-lg font-sans text-sm transition-colors duration-200 ${
                  filter === filterOption.key
                    ? 'bg-champagne text-navy font-medium'
                    : 'bg-ivory text-navy hover:bg-soft-beige'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
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
                    {testimonial.date}
                  </p>
                </div>
                {getStatusBadge(testimonial.status)}
              </div>
              
              <blockquote className="font-serif text-navy italic mb-4 line-clamp-3">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex justify-between items-center text-xs text-navy/60 font-sans">
                <span>Soumis le {new Date(testimonial.submittedAt).toLocaleDateString('fr-FR')}</span>
                {testimonial.status === 'pending' && (
                  <span className="text-yellow-600 font-medium">Action requise</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="font-serif text-xl text-navy mb-2">Aucun témoignage</h3>
            <p className="font-sans text-navy/60">
              {filter === 'all' ? 'Aucun témoignage pour le moment' : `Aucun témoignage ${filter}`}
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
                    <span className="font-sans text-navy/70">{selectedTestimonial.email}</span>
                    {getStatusBadge(selectedTestimonial.status)}
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
                    <span className="font-sans font-semibold text-navy">Date du mariage:</span>
                    <p className="font-sans text-navy/70">{selectedTestimonial.date}</p>
                  </div>
                  <div>
                    <span className="font-sans font-semibold text-navy">Soumis le:</span>
                    <p className="font-sans text-navy/70">
                      {new Date(selectedTestimonial.submittedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {selectedTestimonial.reviewedAt && (
                    <>
                      <div>
                        <span className="font-sans font-semibold text-navy">Examiné le:</span>
                        <p className="font-sans text-navy/70">
                          {new Date(selectedTestimonial.reviewedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <span className="font-sans font-semibold text-navy">Examiné par:</span>
                        <p className="font-sans text-navy/70">{selectedTestimonial.reviewedBy}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                {selectedTestimonial.status === 'pending' && (
                  <div className="flex space-x-4 pt-4 border-t border-champagne/20">
                    <button
                      onClick={() => handleStatusUpdate(selectedTestimonial.id, 'approved')}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-sans font-medium hover:bg-green-700 transition-colors duration-200"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedTestimonial.id, 'rejected')}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg font-sans font-medium hover:bg-red-700 transition-colors duration-200"
                    >
                      Rejeter
                    </button>
                  </div>
                )}

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
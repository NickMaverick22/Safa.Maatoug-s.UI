import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout';
import { getAppointments, updateAppointment, deleteAppointment } from '../../lib/cms-storage';
import { Appointment } from '../../types/cms';
import { toast } from '../../components/ui/sonner';

const CMSAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    setAppointments(getAppointments().sort((a, b) => 
      new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
    ));
  };

  const filteredAppointments = appointments.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const handleStatusUpdate = (id: string, status: Appointment['status']) => {
    const success = updateAppointment(id, { status });
    if (success) {
      loadAppointments();
      toast.success('Statut mis à jour');
      setSelectedAppointment(null);
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      const success = deleteAppointment(id);
      if (success) {
        loadAppointments();
        toast.success('Rendez-vous supprimé');
        setSelectedAppointment(null);
      } else {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      rescheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    const labels = {
      scheduled: 'Planifié',
      confirmed: 'Confirmé',
      completed: 'Terminé',
      cancelled: 'Annulé',
      rescheduled: 'Reprogrammé'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getServiceLabel = (service: string) => {
    const labels = {
      consultation: 'Consultation',
      fitting: 'Essayage',
      'final-fitting': 'Essayage final',
      delivery: 'Livraison'
    };
    return labels[service as keyof typeof labels] || service;
  };

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-serif text-4xl text-navy mb-2">Rendez-vous</h1>
            <p className="font-sans text-navy/70">Gérez les rendez-vous de vos clients</p>
          </div>
          
          {/* Filter */}
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'scheduled', label: 'Planifiés' },
              { key: 'confirmed', label: 'Confirmés' },
              { key: 'completed', label: 'Terminés' },
              { key: 'cancelled', label: 'Annulés' }
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

        {/* Appointments List */}
        <div className="bg-ivory rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-soft-beige">
                <tr>
                  <th className="px-6 py-4 text-left font-sans font-semibold text-navy">Client</th>
                  <th className="px-6 py-4 text-left font-sans font-semibold text-navy">Date & Heure</th>
                  <th className="px-6 py-4 text-left font-sans font-semibold text-navy">Service</th>
                  <th className="px-6 py-4 text-left font-sans font-semibold text-navy">Statut</th>
                  <th className="px-6 py-4 text-left font-sans font-semibold text-navy">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-champagne/20">
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-soft-beige/50 transition-colors duration-200 cursor-pointer"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-sans font-semibold text-navy">
                          {appointment.clientName}
                        </div>
                        <div className="font-sans text-sm text-navy/60">
                          {appointment.clientEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-sans text-navy">
                        {new Date(appointment.appointmentDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="font-sans text-sm text-navy/60">
                        {appointment.appointmentTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-sans text-navy">
                        {getServiceLabel(appointment.service)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppointment(appointment);
                        }}
                        className="text-champagne hover:text-gold font-sans text-sm font-medium"
                      >
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="font-serif text-xl text-navy mb-2">Aucun rendez-vous</h3>
            <p className="font-sans text-navy/60">
              {filter === 'all' ? 'Aucun rendez-vous pour le moment' : `Aucun rendez-vous ${filter}`}
            </p>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-ivory rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-serif text-2xl text-navy font-semibold mb-2">
                    Rendez-vous avec {selectedAppointment.clientName}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="font-sans text-navy/70">
                      {new Date(selectedAppointment.appointmentDate).toLocaleDateString('fr-FR')} à {selectedAppointment.appointmentTime}
                    </span>
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-navy/60 hover:text-navy text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-sans font-semibold text-navy mb-3">Informations client</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-sans font-medium text-navy">Nom:</span>
                        <p className="font-sans text-navy/70">{selectedAppointment.clientName}</p>
                      </div>
                      <div>
                        <span className="font-sans font-medium text-navy">Email:</span>
                        <p className="font-sans text-navy/70">{selectedAppointment.clientEmail}</p>
                      </div>
                      <div>
                        <span className="font-sans font-medium text-navy">Téléphone:</span>
                        <p className="font-sans text-navy/70">{selectedAppointment.clientPhone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-sans font-semibold text-navy mb-3">Détails du rendez-vous</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-sans font-medium text-navy">Service:</span>
                        <p className="font-sans text-navy/70">{getServiceLabel(selectedAppointment.service)}</p>
                      </div>
                      <div>
                        <span className="font-sans font-medium text-navy">Créé le:</span>
                        <p className="font-sans text-navy/70">
                          {new Date(selectedAppointment.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <span className="font-sans font-medium text-navy">Dernière mise à jour:</span>
                        <p className="font-sans text-navy/70">
                          {new Date(selectedAppointment.updatedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <h3 className="font-sans font-semibold text-navy mb-2">Notes</h3>
                    <p className="font-sans text-navy/70 bg-soft-beige p-4 rounded-lg">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}

                {/* Status Actions */}
                <div>
                  <h3 className="font-sans font-semibold text-navy mb-3">Changer le statut</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { status: 'scheduled', label: 'Planifié', color: 'bg-blue-600 hover:bg-blue-700' },
                      { status: 'confirmed', label: 'Confirmé', color: 'bg-green-600 hover:bg-green-700' },
                      { status: 'completed', label: 'Terminé', color: 'bg-gray-600 hover:bg-gray-700' },
                      { status: 'cancelled', label: 'Annulé', color: 'bg-red-600 hover:bg-red-700' }
                    ].map((statusOption) => (
                      <button
                        key={statusOption.status}
                        onClick={() => handleStatusUpdate(selectedAppointment.id, statusOption.status as Appointment['status'])}
                        disabled={selectedAppointment.status === statusOption.status}
                        className={`py-2 px-3 rounded-lg font-sans text-sm font-medium text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${statusOption.color}`}
                      >
                        {statusOption.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-champagne/20">
                  <button
                    onClick={() => handleDelete(selectedAppointment.id)}
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

export default CMSAppointments;
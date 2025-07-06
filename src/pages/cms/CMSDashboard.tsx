import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout';
import { getCMSStats } from '../../lib/cms-storage';
import { CMSStats } from '../../types/cms';

const CMSDashboard = () => {
  const [stats, setStats] = useState<CMSStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await getCMSStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    
    loadStats();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!stats) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne mx-auto mb-4"></div>
            <p className="font-sans text-navy/70">Chargement...</p>
          </div>
        </div>
      </CMSLayout>
    );
  }

  const statCards = [
    {
      title: 'Témoignages',
      value: stats.totalTestimonials,
      subtitle: `${stats.pendingTestimonials} en attente`,
      icon: '💬',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Rendez-vous',
      value: stats.totalAppointments,
      subtitle: `${stats.upcomingAppointments} à venir`,
      icon: '📅',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      title: 'Images',
      value: stats.totalImages,
      subtitle: formatFileSize(stats.storageUsed),
      icon: '🖼️',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Stockage',
      value: formatFileSize(stats.storageUsed),
      subtitle: 'Espace utilisé',
      icon: '💾',
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <CMSLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-4xl text-navy mb-2">Dashboard</h1>
          <p className="font-sans text-navy/70">Vue d'ensemble de votre système de gestion</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} border rounded-xl p-6 hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`text-2xl ${card.iconColor}`}>
                  {card.icon}
                </div>
                <div className="text-right">
                  <div className="font-serif text-2xl font-bold text-navy">
                    {card.value}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-navy mb-1">
                  {card.title}
                </h3>
                <p className="font-sans text-sm text-navy/60">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-ivory rounded-xl p-6 shadow-lg">
          <h2 className="font-serif text-2xl text-navy mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/cms/collections"
              className="flex items-center space-x-3 p-4 bg-soft-beige rounded-lg hover:bg-champagne/20 transition-colors duration-200"
            >
              <span className="text-2xl">👗</span>
              <div>
                <h3 className="font-sans font-semibold text-navy">Gérer les collections</h3>
                <p className="font-sans text-sm text-navy/60">Créer et organiser</p>
              </div>
            </a>
            
            <a
              href="/cms/testimonials"
              className="flex items-center space-x-3 p-4 bg-soft-beige rounded-lg hover:bg-champagne/20 transition-colors duration-200"
            >
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="font-sans font-semibold text-navy">Gérer les témoignages</h3>
                <p className="font-sans text-sm text-navy/60">Approuver ou rejeter</p>
              </div>
            </a>
            
            <a
              href="/cms/appointments"
              className="flex items-center space-x-3 p-4 bg-soft-beige rounded-lg hover:bg-champagne/20 transition-colors duration-200"
            >
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-sans font-semibold text-navy">Voir les rendez-vous</h3>
                <p className="font-sans text-sm text-navy/60">Planifier et organiser</p>
              </div>
            </a>
            
            <a
              href="/cms/gallery"
              className="flex items-center space-x-3 p-4 bg-soft-beige rounded-lg hover:bg-champagne/20 transition-colors duration-200"
            >
              <span className="text-2xl">🖼️</span>
              <div>
                <h3 className="font-sans font-semibold text-navy">Gérer la galerie</h3>
                <p className="font-sans text-sm text-navy/60">Ajouter des images</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-ivory rounded-xl p-6 shadow-lg">
          <h2 className="font-serif text-2xl text-navy mb-6">Activité récente</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-soft-beige rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-sans text-navy">Nouveau témoignage reçu de S. Martin</p>
                <p className="font-sans text-sm text-navy/60">Il y a 2 heures</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-soft-beige rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-sans text-navy">Rendez-vous confirmé avec Marie Dubois</p>
                <p className="font-sans text-sm text-navy/60">Il y a 1 jour</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-soft-beige rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-sans text-navy">Nouvelle image ajoutée à la collection</p>
                <p className="font-sans text-sm text-navy/60">Il y a 3 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};

export default CMSDashboard;
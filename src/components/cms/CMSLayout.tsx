import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../lib/auth';
import { User } from '../../types/cms';
import { LayoutDashboard, Shirt, MessageSquare, Calendar, Image } from 'lucide-react';

interface CMSLayoutProps {
  children: React.ReactNode;
}

const CMSLayout: React.FC<CMSLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (!currentUser) {
          navigate('/cms/login');
        }
      } catch (error) {
        console.error('Error checking user:', error);
        navigate('/cms/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/cms/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/cms/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne mx-auto mb-4"></div>
          <p className="font-sans text-navy/70">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { path: '/cms', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/cms/collections', label: 'Collections', icon: <Shirt className="h-5 w-5" /> },
    { path: '/cms/testimonials', label: 'Témoignages', icon: <MessageSquare className="h-5 w-5" />, badge: 'pendingTestimonials' },
    { path: '/cms/appointments', label: 'Rendez-vous', icon: <Calendar className="h-5 w-5" /> },
    { path: '/cms/gallery', label: 'Galerie', icon: <Image className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-soft-beige">
      {/* Header */}
      <header className="bg-ivory text-navy shadow-lg border-b border-champagne/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/bdb13012-59ce-422b-8158-5a780a8fa555.png" 
                  alt="Safa Maatoug Logo" 
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="bg-soft-beige text-navy px-4 py-2 rounded-lg font-sans text-sm font-medium hover:bg-champagne transition-colors duration-200"
              >
                ← Retour au site
              </Link>
              <span className="font-sans text-sm text-navy/70">Bonjour, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-champagne text-navy px-4 py-2 rounded-lg font-sans text-sm font-medium hover:bg-gold transition-colors duration-200"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-ivory shadow-lg min-h-screen border-r border-champagne/20">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-sans text-sm transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-champagne text-navy font-medium shadow-sm'
                      : 'text-navy hover:bg-soft-beige hover:text-champagne'
                  }`}
                >
                  <span className="text-champagne">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-soft-beige min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CMSLayout;
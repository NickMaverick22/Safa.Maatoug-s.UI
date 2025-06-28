import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser, generateToken } from '../../lib/auth';
import { toast } from '../../components/ui/sonner';

const CMSLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await authenticateUser(email, password);
      
      if (user) {
        const token = generateToken(user);
        localStorage.setItem('cms_token', token);
        toast.success('Connexion réussie');
        navigate('/cms');
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-beige flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-ivory rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/bdb13012-59ce-422b-8158-5a780a8fa555.png" 
              alt="Safa Maatoug Logo" 
              className="h-16 w-auto mx-auto mb-4"
            />
            <h1 className="font-serif text-3xl text-navy mb-2">CMS Admin</h1>
            <p className="font-sans text-navy/70">Accès au système de gestion</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block font-sans text-sm font-medium text-navy mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans"
                placeholder="admin@safamaatoug.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-sans text-sm font-medium text-navy mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-navy text-ivory py-3 rounded-lg font-sans font-medium hover:bg-champagne hover:text-navy transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-soft-beige rounded-lg">
            <p className="font-sans text-xs text-navy/60 text-center mb-2">Identifiants de démonstration:</p>
            <p className="font-sans text-xs text-navy/80 text-center">
              Email: admin@safamaatoug.com<br />
              Mot de passe: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSLogin;
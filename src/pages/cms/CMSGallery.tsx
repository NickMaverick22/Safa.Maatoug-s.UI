import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout';
import { 
  getGalleryImages, 
  updateGalleryImage, 
  deleteGalleryImage, 
  addGalleryImage 
} from '../../lib/cms-storage';
import { getCurrentUser } from '../../lib/auth';
import { GalleryImage } from '../../types/cms';
import { toast } from '../../components/ui/sonner';

const CMSGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState<'all' | 'collection' | 'atelier' | 'hero' | 'testimonials'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await getGalleryImages();
      setImages(data);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Erreur lors du chargement des images');
    }
  };

  const filteredImages = images.filter(img => {
    if (filter === 'all') return true;
    return img.category === filter;
  });

  const handleImageUpdate = async (id: string, updates: Partial<GalleryImage>) => {
    try {
      const success = await updateGalleryImage(id, updates);
      if (success) {
        loadImages();
        toast.success('Image mise à jour');
        setSelectedImage(null);
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      try {
        const success = await deleteGalleryImage(id);
        if (success) {
          loadImages();
          toast.success('Image supprimée');
          setSelectedImage(null);
        } else {
          toast.error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} n'est pas une image valide`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} est trop volumineux (max 10MB)`);
          continue;
        }

        const imageData = {
          originalName: file.name,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          category: 'collection' as const,
          tags: [],
          uploadedBy: user.email
        };

        const newImage = await addGalleryImage(file, imageData);
        if (!newImage) {
          toast.error(`Erreur lors du téléchargement de ${file.name}`);
        }
      }

      loadImages();
      toast.success(`${files.length} image(s) téléchargée(s)`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      collection: 'bg-purple-100 text-purple-800 border-purple-200',
      atelier: 'bg-blue-100 text-blue-800 border-blue-200',
      hero: 'bg-green-100 text-green-800 border-green-200',
      testimonials: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    const labels = {
      collection: 'Collection',
      atelier: 'Atelier',
      hero: 'Hero',
      testimonials: 'Témoignages'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[category as keyof typeof styles]}`}>
        {labels[category as keyof typeof labels]}
      </span>
    );
  };

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-serif text-4xl text-navy mb-2">Galerie</h1>
            <p className="font-sans text-navy/70">Gérez les images de votre site web</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Upload Button */}
            <label className="bg-champagne text-navy px-6 py-3 rounded-lg font-sans font-medium hover:bg-gold transition-colors duration-200 cursor-pointer">
              {isUploading ? 'Téléchargement...' : 'Ajouter des images'}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {/* Filter */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'collection', label: 'Collection' },
            { key: 'atelier', label: 'Atelier' },
            { key: 'hero', label: 'Hero' },
            { key: 'testimonials', label: 'Témoignages' }
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

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="bg-ivory rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getCategoryBadge(image.category)}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-sans font-semibold text-navy mb-1 truncate">
                  {image.alt}
                </h3>
                <p className="font-sans text-sm text-navy/60 mb-2">
                  {formatFileSize(image.size)} • {image.dimensions.width}×{image.dimensions.height}
                </p>
                <div className="flex flex-wrap gap-1">
                  {image.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-soft-beige text-navy/70 rounded text-xs font-sans"
                    >
                      {tag}
                    </span>
                  ))}
                  {image.tags.length > 3 && (
                    <span className="px-2 py-1 bg-soft-beige text-navy/70 rounded text-xs font-sans">
                      +{image.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="font-serif text-xl text-navy mb-2">Aucune image</h3>
            <p className="font-sans text-navy/60">
              {filter === 'all' ? 'Aucune image pour le moment' : `Aucune image dans la catégorie ${filter}`}
            </p>
          </div>
        )}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-ivory rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-serif text-2xl text-navy font-semibold mb-2">
                    {selectedImage.alt}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="font-sans text-navy/70">{selectedImage.filename}</span>
                    {getCategoryBadge(selectedImage.category)}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-navy/60 hover:text-navy text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div>
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>

                {/* Image Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-sans font-semibold text-navy mb-3">Informations</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-sans font-medium text-navy">Taille:</span>
                        <p className="font-sans text-navy/70">{formatFileSize(selectedImage.size)}</p>
                      </div>
                      <div>
                        <span className="font-sans font-medium text-navy">Dimensions:</span>
                        <p className="font-sans text-navy/70">
                          {selectedImage.dimensions.width} × {selectedImage.dimensions.height} px
                        </p>
                      </div>
                      <div>
                        <span className="font-sans font-medium text-navy">Téléchargé par:</span>
                        <p className="font-sans text-navy/70">{selectedImage.uploadedBy}</p>
                      </div>
                      <div>
                        <span className="font-sans font-medium text-navy">Date:</span>
                        <p className="font-sans text-navy/70">
                          {new Date(selectedImage.uploadedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-sans font-semibold text-navy mb-3">Modifier</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block font-sans text-sm font-medium text-navy mb-1">
                          Texte alternatif
                        </label>
                        <input
                          type="text"
                          value={selectedImage.alt}
                          onChange={(e) => setSelectedImage({...selectedImage, alt: e.target.value})}
                          className="w-full px-3 py-2 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-sm font-medium text-navy mb-1">
                          Catégorie
                        </label>
                        <select
                          value={selectedImage.category}
                          onChange={(e) => setSelectedImage({...selectedImage, category: e.target.value as any})}
                          className="w-full px-3 py-2 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans text-sm"
                        >
                          <option value="collection">Collection</option>
                          <option value="atelier">Atelier</option>
                          <option value="hero">Hero</option>
                          <option value="testimonials">Témoignages</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-sans text-sm font-medium text-navy mb-1">
                          Tags (séparés par des virgules)
                        </label>
                        <input
                          type="text"
                          value={selectedImage.tags.join(', ')}
                          onChange={(e) => setSelectedImage({
                            ...selectedImage, 
                            tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                          })}
                          className="w-full px-3 py-2 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans text-sm"
                          placeholder="haute-couture, bleu, plumes"
                        />
                      </div>

                      <button
                        onClick={() => handleImageUpdate(selectedImage.id, {
                          alt: selectedImage.alt,
                          category: selectedImage.category,
                          tags: selectedImage.tags
                        })}
                        className="w-full bg-champagne text-navy py-3 rounded-lg font-sans font-medium hover:bg-gold transition-colors duration-200"
                      >
                        Sauvegarder les modifications
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-champagne/20">
                    <button
                      onClick={() => handleDelete(selectedImage.id)}
                      className="w-full bg-red-100 text-red-700 py-3 rounded-lg font-sans font-medium hover:bg-red-200 transition-colors duration-200"
                    >
                      Supprimer définitivement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </CMSLayout>
  );
};

export default CMSGallery;
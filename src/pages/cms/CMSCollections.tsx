import React, { useState, useEffect } from 'react';
import CMSLayout from '../../components/cms/CMSLayout';
import { 
  getAllCollections, 
  addCollection, 
  updateCollection, 
  deleteCollection,
  getCollectionById,
  getGalleryImages
} from '../../lib/cms-storage';
import { Collection, GalleryImage } from '../../types/cms';
import { toast } from '../../components/ui/sonner';

const CMSCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverImage: '',
    images: [] as string[],
    isActive: true
  });

  useEffect(() => {
    loadCollections();
    loadGalleryImages();
  }, []);

  const loadCollections = async () => {
    try {
      const data = await getAllCollections();
      setCollections(data);
    } catch (error) {
      console.error('Error loading collections:', error);
      toast.error('Erreur lors du chargement des collections');
    }
  };

  const loadGalleryImages = async () => {
    try {
      const data = await getGalleryImages();
      setGalleryImages(data.filter(img => img.category === 'collection'));
    } catch (error) {
      console.error('Error loading gallery images:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Le nom et la description sont requis');
      return;
    }

    try {
      if (selectedCollection) {
        // Update existing collection
        const success = await updateCollection(selectedCollection.id, formData);
        if (success) {
          toast.success('Collection mise à jour');
          loadCollections();
          resetForm();
        } else {
          toast.error('Erreur lors de la mise à jour');
        }
      } else {
        // Create new collection
        const newCollection = await addCollection(formData);
        if (newCollection) {
          toast.success('Collection créée');
          loadCollections();
          resetForm();
        } else {
          toast.error('Erreur lors de la création');
        }
      }
    } catch (error) {
      console.error('Error saving collection:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      coverImage: '',
      images: [],
      isActive: true
    });
    setSelectedCollection(null);
    setIsCreating(false);
  };

  const handleEdit = (collection: Collection) => {
    setSelectedCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description,
      coverImage: collection.coverImage,
      images: collection.images,
      isActive: collection.isActive
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette collection ?')) {
      try {
        const success = await deleteCollection(id);
        if (success) {
          toast.success('Collection supprimée');
          loadCollections();
        } else {
          toast.error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Error deleting collection:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const addImageToCollection = (imageUrl: string) => {
    if (!formData.images.includes(imageUrl)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    }
    setShowImageSelector(false);
  };

  const removeImageFromCollection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const setCoverImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: imageUrl
    }));
  };

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-serif text-4xl text-navy mb-2">Collections</h1>
            <p className="font-sans text-navy/70">Gérez vos collections de robes</p>
          </div>
          
          <button
            onClick={() => setIsCreating(true)}
            className="bg-champagne text-navy px-6 py-3 rounded-lg font-sans font-medium hover:bg-gold transition-colors duration-200"
          >
            Nouvelle Collection
          </button>
        </div>

        {/* Collections Grid */}
        {!isCreating && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-ivory rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={collection.coverImage}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      collection.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {collection.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-serif text-xl text-navy mb-2">
                    {collection.name}
                  </h3>
                  <p className="font-sans text-sm text-navy/70 mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-navy/60 mb-4">
                    <span>{collection.images.length} images</span>
                    <span>{new Date(collection.updatedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(collection)}
                      className="flex-1 bg-navy text-ivory py-2 rounded-lg font-sans text-sm hover:bg-champagne hover:text-navy transition-colors duration-200"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(collection.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-sans text-sm hover:bg-red-200 transition-colors duration-200"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {collections.length === 0 && !isCreating && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👗</div>
            <h3 className="font-serif text-xl text-navy mb-2">Aucune collection</h3>
            <p className="font-sans text-navy/60">
              Créez votre première collection pour commencer
            </p>
          </div>
        )}

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-ivory rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-navy">
                {selectedCollection ? 'Modifier la collection' : 'Nouvelle collection'}
              </h2>
              <button
                onClick={resetForm}
                className="text-navy/60 hover:text-navy text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-sm font-medium text-navy mb-2">
                    Nom de la collection *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans"
                    placeholder="Haute Couture 2024"
                    required
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-medium text-navy mb-2">
                    Image de couverture
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                      className="flex-1 px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans"
                      placeholder="https://..."
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowImageSelector(true)}
                        className="bg-champagne text-navy px-4 py-3 rounded-lg font-sans text-sm hover:bg-gold transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Galerie
                      </button>
                    </div>
                  </div>
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt="Aperçu"
                      className="mt-2 w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-navy mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-champagne/30 rounded-lg focus:ring-2 focus:ring-champagne focus:border-transparent font-sans resize-none"
                  placeholder="Description de la collection..."
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block font-sans text-sm font-medium text-navy">
                    Images de la collection ({formData.images.length})
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowImageSelector(true)}
                      className="bg-champagne text-navy px-4 py-2 rounded-lg font-sans text-sm hover:bg-gold transition-colors duration-200 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Ajouter de la galerie
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-full aspect-[3/4] object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageFromCollection(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="font-sans text-sm text-navy">
                  Collection active (visible sur le site)
                </label>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-ivory text-navy px-6 py-3 rounded-lg font-sans font-medium border-2 border-navy hover:bg-soft-beige transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-navy text-ivory px-6 py-3 rounded-lg font-sans font-medium hover:bg-champagne hover:text-navy transition-colors duration-200"
                >
                  {selectedCollection ? 'Mettre à jour' : 'Créer la collection'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Image Selector Modal */}
        {showImageSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-ivory rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-serif text-2xl text-navy">Choisir une image</h2>
                  <button
                    onClick={() => setShowImageSelector(false)}
                    className="text-navy/60 hover:text-navy text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative group cursor-pointer"
                      onClick={() => addImageToCollection(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full aspect-[3/4] object-cover rounded-lg hover:opacity-80 transition-opacity duration-200"
                      />
                      <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-200 rounded-lg flex items-center justify-center">
                        <span className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-sans text-sm">
                          Sélectionner
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverImage(image.url);
                          setShowImageSelector(false);
                        }}
                        className="absolute top-2 left-2 bg-champagne text-navy px-2 py-1 rounded text-xs font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        Couverture
                      </button>
                    </div>
                  ))}
                </div>

                {galleryImages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🖼️</div>
                    <h3 className="font-serif text-xl text-navy mb-2">Aucune image</h3>
                    <p className="font-sans text-navy/60">
                      Ajoutez des images à la galerie pour les utiliser dans vos collections
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </CMSLayout>
  );
};

export default CMSCollections;
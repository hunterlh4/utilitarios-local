import { useState, useRef } from 'react';
import { useGetAllAnimeGalery } from './hooks/useGetAllAnimeGalery.hook';
import { useCreateAnimeGalery } from './hooks/useCreateAnimeGalery.hook';
import { useUpdateAnimeGalery } from './hooks/useUpdateAnimeGalery.hook';
import { useDeleteAnimeGalery } from './hooks/useDeleteAnimeGalery.hook';
import { useUploadImage } from './hooks/useUploadImage.hook';
import { useGetMediaByRefId } from './hooks/useGetMediaByRefId.hook';
import { Button } from '@/common/components/ui/button';
import { Spinner } from '@/common/components/ui/spinner';
import { Plus, Upload, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { CreateGaleryDialog } from './components/CreateGaleryDialog';
import { EditGaleryDialog } from './components/EditGaleryDialog';
import { useQuery } from '@tanstack/react-query';
import { animeGaleryService } from './services/anime-galery.service';

export const AnimeGaleryPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGalery, setSelectedGalery] = useState<number | null>(null);
  const [editingGaleryId, setEditingGaleryId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: galeries, isLoading } = useGetAllAnimeGalery();
  const createGalery = useCreateAnimeGalery();
  const updateGalery = useUpdateAnimeGalery();
  const deleteGalery = useDeleteAnimeGalery();
  const uploadImage = useUploadImage();
  const { data: media, isLoading: isLoadingMedia } = useGetMediaByRefId(selectedGalery);
  
  const { data: editingGaleryDetail, isLoading: isLoadingEdit } = useQuery({
    queryKey: ['animeGaleryDetail', editingGaleryId],
    queryFn: () => animeGaleryService.getById(editingGaleryId!),
    enabled: !!editingGaleryId,
  });

  const handleCreateGalery = async (name: string, image: File | null) => {
    try {
      // Primero crear la galería
      const result = await createGalery.mutateAsync(name);
      
      // Si hay imagen, subirla con el ID de la galería creada
      if (image && result.id) {
        await uploadImage.mutateAsync({ file: image, refId: result.id });
        toast.success('Galería creada e imagen subida correctamente');
      } else {
        toast.success('Galería creada correctamente');
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error al crear galería:', error);
      toast.error('Error al crear la galería');
    }
  };

  const handleDeleteGalery = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteGalery.mutateAsync(id);
      toast.success('Galería eliminada correctamente');
      if (selectedGalery === id) {
        setSelectedGalery(null);
      }
    } catch (error) {
      console.error('Error al eliminar galería:', error);
      toast.error('Error al eliminar la galería');
    }
  };

  const handleEditGalery = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGaleryId(id);
    setEditDialogOpen(true);
  };

  const handleUpdateGalery = async (name: string, mediaId?: number) => {
    if (!editingGaleryId) return;
    try {
      await updateGalery.mutateAsync({
        id: editingGaleryId,
        payload: { name, mediaId },
      });
      toast.success('Galería actualizada correctamente');
      setEditDialogOpen(false);
      setEditingGaleryId(null);
    } catch (error) {
      console.error('Error al actualizar galería:', error);
      toast.error('Error al actualizar la galería');
    }
  };

  const handleSelectGalery = (id: number) => {
    setSelectedGalery(id);
  };

  const handleUploadClick = () => {
    if (!selectedGalery) {
      toast.error('Selecciona una galería primero');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedGalery) return;

    for (const file of Array.from(files)) {
      try {
        await uploadImage.mutateAsync({ file, refId: selectedGalery });
        toast.success(`Imagen ${file.name} subida correctamente`);
      } catch (error) {
        console.error('Error al subir imagen:', error);
        toast.error(`Error al subir ${file.name}`);
      }
    }

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectedGaleryData = galeries?.find((g) => g.id === selectedGalery);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 
          className={`text-3xl font-bold ${selectedGalery ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
          onClick={() => selectedGalery && setSelectedGalery(null)}
        >
          {selectedGaleryData?.name || 'Galería Anime'}
        </h1>
        <div className="flex gap-2">
          {selectedGalery ? (
            <Button
              onClick={handleUploadClick}
              disabled={uploadImage.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir Imágenes
            </Button>
          ) : (
            <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Galería
            </Button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Galerías */}
      {!selectedGalery && (
        <div>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : galeries && galeries.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
              {galeries.map((galery) => (
                <div
                  key={galery.id}
                  className="relative w-full cursor-pointer transition-all hover:opacity-90"
                  style={{ paddingBottom: '150%' }}
                  onClick={() => handleSelectGalery(galery.id)}
                >
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7 z-10 opacity-80 hover:opacity-100"
                    onClick={(e) => handleDeleteGalery(galery.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 left-2 h-7 w-7 z-10 opacity-80 hover:opacity-100"
                    onClick={(e) => handleEditGalery(galery.id, e)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  {galery.firstImageUrl ? (
                    <img 
                      src={galery.firstImageUrl} 
                      alt={galery.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-4xl">📁</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No hay galerías creadas</p>
          )}
        </div>
      )}

      {/* Imágenes de la galería seleccionada */}
      {selectedGalery && (
        <div>
          {isLoadingMedia ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : media && media.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
              {media.map((img) => (
                <div key={img.id} className="relative w-full" style={{ paddingBottom: '150%' }}>
                  <img 
                    src={img.url} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No hay imágenes en esta galería</p>
          )}
        </div>
      )}

      <CreateGaleryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleCreateGalery}
      />

      <EditGaleryDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingGaleryId(null);
        }}
        galery={editingGaleryDetail || null}
        firstImageUrl={galeries?.find(g => g.id === editingGaleryId)?.firstImageUrl}
        isLoading={isLoadingEdit || updateGalery.isPending}
        onSave={handleUpdateGalery}
      />
    </div>
  );
};

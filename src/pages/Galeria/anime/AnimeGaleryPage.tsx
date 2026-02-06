import { useState, useRef } from 'react';
import { useGetAllAnimeGalery } from './hooks/useGetAllAnimeGalery.hook';
import { useCreateAnimeGalery } from './hooks/useCreateAnimeGalery.hook';
import { useDeleteAnimeGalery } from './hooks/useDeleteAnimeGalery.hook';
import { useUploadImage } from './hooks/useUploadImage.hook';
import { useGetMediaByRefId } from './hooks/useGetMediaByRefId.hook';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader } from '@/common/components/ui/card';
import { Spinner } from '@/common/components/ui/spinner';
import { Plus, Upload, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { CreateGaleryDialog } from './components/CreateGaleryDialog';

export const AnimeGaleryPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGalery, setSelectedGalery] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: galeries, isLoading } = useGetAllAnimeGalery();
  const createGalery = useCreateAnimeGalery();
  const deleteGalery = useDeleteAnimeGalery();
  const uploadImage = useUploadImage();
  const { data: media, isLoading: isLoadingMedia } = useGetMediaByRefId(selectedGalery);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Galería Anime</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleUploadClick}
            disabled={!selectedGalery || uploadImage.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Subir Imágenes
          </Button>
          <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Galería
          </Button>
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
      <div>
        <h2 className="text-xl font-semibold mb-4">Galerías</h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        ) : galeries && galeries.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {galeries.map((galery) => (
              <Card
                key={galery.id}
                className={`cursor-pointer transition-all ${
                  selectedGalery === galery.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSelectGalery(galery.id)}
              >
                <CardHeader className="p-4 relative">
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={(e) => handleDeleteGalery(galery.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <div className="aspect-square bg-muted rounded flex items-center justify-center">
                    <span className="text-4xl">📁</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="font-medium text-center truncate">{galery.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No hay galerías creadas</p>
        )}
      </div>

      {/* Imágenes de la galería seleccionada */}
      {selectedGalery && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Imágenes</h2>
            <Button size="sm" variant="outline" onClick={() => setSelectedGalery(null)}>
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </div>
          {isLoadingMedia ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : media && media.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {media.map((img) => (
                <Card key={img.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="aspect-square w-full overflow-hidden bg-muted">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  </CardHeader>
                </Card>
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
    </div>
  );
};

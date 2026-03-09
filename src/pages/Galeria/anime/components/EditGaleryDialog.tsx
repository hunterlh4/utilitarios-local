import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Check } from 'lucide-react';
import type { AnimeGaleryDetail } from '../models/anime-galery.model';

interface EditGaleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  galery: AnimeGaleryDetail | null;
  firstImageUrl?: string;
  isLoading: boolean;
  onSave: (name: string, mediaId?: number) => void;
}

export const EditGaleryDialog = ({
  open,
  onOpenChange,
  galery,
  firstImageUrl,
  isLoading,
  onSave,
}: EditGaleryDialogProps) => {
  const [name, setName] = useState('');
  const [selectedMediaId, setSelectedMediaId] = useState<number | undefined>();

  useEffect(() => {
    if (galery) {
      setName(galery.name);
      // Buscar el media que coincide con firstImageUrl
      const currentMedia = firstImageUrl 
        ? galery.media.find(m => m.url === firstImageUrl)
        : null;
      
      if (currentMedia) {
        setSelectedMediaId(currentMedia.id);
      } else if (firstImageUrl) {
        // Si firstImageUrl existe pero no está en media, usar ID temporal
        setSelectedMediaId(-1);
      } else {
        // Si no hay firstImageUrl, usar el primero de la lista
        setSelectedMediaId(galery.media[0]?.id);
      }
    }
  }, [galery, firstImageUrl]);

  const handleSave = () => {
    if (!name.trim()) return;
    // Si el mediaId seleccionado es -1, significa que es la imagen antigua
    // En ese caso, enviamos undefined para que el backend no cambie la portada
    // O si prefieres, usa el primer media real de la lista
    let mediaIdToSend = selectedMediaId;
    if (selectedMediaId === -1) {
      // Opción 1: No enviar mediaId (mantener la actual)
      mediaIdToSend = undefined;
      // Opción 2: Usar el primer media real
      // mediaIdToSend = galery?.media[0]?.id;
    }
    onSave(name, mediaIdToSend);
  };

  if (!galery) return null;

  // Crear lista de medias, agregando firstImageUrl al inicio si no está en la lista
  const mediaList = [...galery.media];
  
  if (firstImageUrl) {
    const existingMedia = galery.media.find(m => m.url === firstImageUrl);
    if (!existingMedia) {
      // Si la imagen de portada no está en la lista, agrégala con ID temporal
      mediaList.unshift({
        id: -1,
        url: firstImageUrl,
        orderIndex: -1,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Galería</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la galería"
            />
          </div>

          {mediaList.length > 0 && (
            <div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                {mediaList.map((media) => (
                  <div
                    key={media.id}
                    className={`relative cursor-pointer rounded overflow-hidden border-2 transition-all ${
                      selectedMediaId === media.id
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMediaId(media.id)}
                    style={{ paddingBottom: '100%' }}
                  >
                    <img
                      src={media.url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {selectedMediaId === media.id && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!name.trim() || isLoading}>
              {isLoading ? <Spinner className="h-4 w-4" /> : 'Guardar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

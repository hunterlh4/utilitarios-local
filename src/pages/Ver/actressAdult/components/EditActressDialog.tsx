import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Checkbox } from '@/common/components/ui/checkbox';
import { useGetTags } from '../hooks/useGetTags.hook';
import { useGetActressById } from '../hooks/useGetActressById.hook';
import { X } from 'lucide-react';

interface EditActressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actressId: number | null;
  onSave: (id: number, name: string, tagIds: number[], newImage: File | null, imagesToDelete: number[]) => void;
}

export const EditActressDialog = ({ open, onOpenChange, actressId, onSave }: EditActressDialogProps) => {
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: actress, isLoading: isLoadingActress } = useGetActressById(actressId);
  const { data: tags, isLoading: isLoadingTags } = useGetTags(5); // 5 = ActressAdult

  useEffect(() => {
    if (actress) {
      setName(actress.name);
      setSelectedTags(actress.tagIds || []);
      setImagesToDelete([]);
      setNewImage(null);
    }
  }, [actress]);

  const handleSave = async () => {
    if (!name.trim() || !actressId) return;
    setIsLoading(true);
    await onSave(actressId, name, selectedTags, newImage, imagesToDelete);
    setIsLoading(false);
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewImage(file);
    // Si hay una nueva imagen, marcar las existentes para eliminar
    if (file && actress?.images && actress.images.length > 0) {
      setImagesToDelete(actress.images.map(img => img.id));
    }
  };

  const handleRemoveNewImage = () => {
    setNewImage(null);
    setImagesToDelete([]);
  };

  const currentImages = actress?.images?.filter(img => !imagesToDelete.includes(img.id)) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Actriz</DialogTitle>
        </DialogHeader>
        {isLoadingActress ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Mostrar imágenes actuales */}
            {currentImages.length > 0 && !newImage && (
              <div>
                <p className="text-sm font-medium mb-2">Imagen actual:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {currentImages.map((image) => (
                    <div key={image.id} className="relative aspect-[2/3]">
                      <img
                        src={image.url}
                        alt="Imagen actual"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview de nueva imagen */}
            {newImage && (
              <div>
                <p className="text-sm font-medium mb-2">Nueva imagen:</p>
                <div className="relative aspect-[2/3] max-w-[200px]">
                  <img
                    src={URL.createObjectURL(newImage)}
                    alt="Nueva imagen"
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={handleRemoveNewImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            
            {isLoadingTags ? (
              <div className="flex justify-center py-4">
                <Spinner className="h-6 w-6" />
              </div>
            ) : tags && tags.length > 0 ? (
              <div>
                <p className="text-sm font-medium mb-2">Tags:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={() => toggleTag(tag.id)}
                      />
                      <label
                        htmlFor={`tag-${tag.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {tag.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!name.trim() || isLoading}>
                {isLoading ? <Spinner className="h-4 w-4" /> : 'Guardar'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

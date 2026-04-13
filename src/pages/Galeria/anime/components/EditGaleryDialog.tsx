import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import type { AnimeGaleryDetail } from '../models/anime-galery.model';

interface EditGaleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  galery: AnimeGaleryDetail | null;
  isLoading: boolean;
  onSave: (name: string) => void;
}

export const EditGaleryDialog = ({
  open,
  onOpenChange,
  galery,
  isLoading,
  onSave,
}: EditGaleryDialogProps) => {
  const [name, setName] = useState(galery?.name ?? '');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name);
  };

  if (!galery) return null;

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

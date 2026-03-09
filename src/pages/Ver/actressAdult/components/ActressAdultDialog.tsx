import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import type { ActressAdult } from '../models/actressAdult.model';

interface ActressAdultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingActress: ActressAdult | null;
  onSave: (actress: ActressAdult) => void;
}

export const ActressAdultDialog = ({
  open,
  onOpenChange,
  editingActress,
  onSave,
}: ActressAdultDialogProps) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (editingActress) {
      setName(editingActress.name);
      setImage(editingActress.image || '');
    } else {
      setName('');
      setImage('');
    }
  }, [editingActress, open]);

  const handleSave = () => {
    const actress: ActressAdult = {
      id: editingActress?.id || 0,
      name,
      image,
      createdAt: editingActress?.createdAt || new Date().toISOString(),
    };
    onSave(actress);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingActress ? 'Editar' : 'Agregar'} Actriz Porno</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder="URL de imagen"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

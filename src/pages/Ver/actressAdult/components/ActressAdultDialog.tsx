import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Plus, X } from 'lucide-react';
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
  const [links, setLinks] = useState<string[]>(['']);

  useEffect(() => {
    if (editingActress) {
      setName(editingActress.name);
      setImage(editingActress.image);
      setLinks(editingActress.links.map((l) => l.url));
    } else {
      setName('');
      setImage('');
      setLinks(['']);
    }
  }, [editingActress, open]);

  const handleAddLink = () => {
    setLinks([...links, '']);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleSave = () => {
    const actress: ActressAdult = {
      id: editingActress?.id || 0,
      name,
      image,
      links: links.filter((l) => l.trim()).map((url, index) => ({ id: index, url })),
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
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Enlaces</label>
              <Button size="sm" onClick={handleAddLink}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            {links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Enlace ${index + 1}`}
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                />
                {links.length > 1 && (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveLink(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!name.trim() || !image.trim()}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

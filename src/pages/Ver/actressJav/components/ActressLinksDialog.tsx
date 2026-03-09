import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import type { ActressJav } from '../models/actress.model';

interface ActressLinksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actress: ActressJav | null;
  onSave: (actressId: number, links: string[]) => void;
}

export const ActressLinksDialog = ({ open, onOpenChange, actress, onSave }: ActressLinksDialogProps) => {
  const [links, setLinks] = useState<string[]>([]);

  useEffect(() => {
    if (actress && actress.links) {
      setLinks(actress.links.map(link => link.url));
    } else {
      setLinks([]);
    }
  }, [actress, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (actress) {
      const filteredLinks = links.filter(link => link.trim() !== '');
      onSave(actress.id, filteredLinks);
    }
  };

  const addLink = () => {
    setLinks([...links, '']);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Enlaces - {actress?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Enlaces</Label>
              <Button type="button" size="sm" onClick={addLink} className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            {links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => removeLink(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {links.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay enlaces. Haz clic en "Agregar" para añadir uno.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

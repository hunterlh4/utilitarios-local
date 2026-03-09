import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Spinner } from '@/common/components/ui/spinner';
import { useGetTagsByType } from '@/common/hooks/useGetTagsByType.hook';
import { actressJavService } from '../services/actressJav.service';
import { toast } from 'sonner';
import type { ActressJav } from '../models/actress.model';

interface ActressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingActress: ActressJav | null;
  onSave: (actress: any) => void;
}

export const ActressDialog = ({ open, onOpenChange, editingActress, onSave }: ActressDialogProps) => {
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [checkingName, setCheckingName] = useState(false);
  const [nameExists, setNameExists] = useState(false);

  const { data: tags, isLoading: isLoadingTags } = useGetTagsByType(7); // 7 = JAV tags

  // Validar nombre automáticamente
  useEffect(() => {
    const checkName = async () => {
      const nameTrimmed = name.trim();
      
      if (nameTrimmed.length >= 3 && (!editingActress || editingActress.name !== nameTrimmed)) {
        setCheckingName(true);
        try {
          const exists = await actressJavService.checkNameExists(nameTrimmed);
          setNameExists(exists);
          if (exists) {
            toast.warning(`El nombre "${nameTrimmed}" ya existe`);
          }
        } catch (error) {
          console.error('Error al verificar nombre:', error);
        } finally {
          setCheckingName(false);
        }
      } else {
        setNameExists(false);
      }
    };

    const timeoutId = setTimeout(checkName, 500);
    return () => clearTimeout(timeoutId);
  }, [name, editingActress]);

  useEffect(() => {
    if (editingActress) {
      setName(editingActress.name);
      
      // Mapear tags de string a IDs
      if (editingActress.tags && tags && tags.length > 0) {
        const tagIds = editingActress.tags
          .map(tagName => tags.find(t => t.name === tagName)?.id)
          .filter((id): id is number => id !== undefined);
        setSelectedTags(tagIds);
      }
    } else {
      setName('');
      setSelectedTags([]);
    }
  }, [editingActress, open, tags]);

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nameExists) {
      toast.error('No puedes usar un nombre que ya existe');
      return;
    }
    
    onSave({
      ...(editingActress || {}),
      name: name.trim(),
      tagIds: selectedTags,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingActress ? 'Editar Actriz' : 'Agregar Actriz'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">
              Nombre <span className="text-red-500">*</span>
              {checkingName && <span className="text-xs text-muted-foreground ml-2">Verificando...</span>}
              {nameExists && <span className="text-xs text-red-500 ml-2">⚠️ Ya existe</span>}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la actriz"
              required
              className={nameExists ? 'border-red-500' : ''}
            />
          </div>

          {isLoadingTags ? (
            <div className="flex justify-center py-4">
              <Spinner className="h-6 w-6" />
            </div>
          ) : tags && tags.length > 0 ? (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded p-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`p-2 rounded cursor-pointer text-sm transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-purple-500 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={nameExists || checkingName}>
              {editingActress ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

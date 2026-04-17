import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Checkbox } from '@/common/components/ui/checkbox';
import { useGetTags } from '../hooks/useGetTags.hook';
import { useGetActressById } from '../hooks/useGetActressById.hook';

interface EditActressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actressId: number | null;
  onSave: (id: number, name: string, tagIds: number[]) => void;
}

export const EditActressDialog = ({ open, onOpenChange, actressId, onSave }: EditActressDialogProps) => {
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: actress, isLoading: isLoadingActress } = useGetActressById(actressId);
  const { data: tags, isLoading: isLoadingTags } = useGetTags(5); // 5 = ActressAdult

  useEffect(() => {
    if (actress) {
      setName(actress.name);
      setSelectedTags(actress.tagIds || []);
    }
  }, [actress]);

  const handleSave = async () => {
    if (!name.trim() || !actressId) return;
    setIsLoading(true);
    await onSave(actressId, name, selectedTags);
    setIsLoading(false);
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

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

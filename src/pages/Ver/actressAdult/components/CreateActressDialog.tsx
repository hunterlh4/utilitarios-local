import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Checkbox } from '@/common/components/ui/checkbox';
import { TagType } from '@/common/enums/tag.enum';
import { useGetTags } from '../hooks/useGetTags.hook';

interface CreateActressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, tagIds: number[]) => void;
}

export const CreateActressDialog = ({ open, onOpenChange, onSave }: CreateActressDialogProps) => {
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: tags, isLoading: isLoadingTags } = useGetTags(TagType.ActressAdult);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    await onSave(name, selectedTags);
    setIsLoading(false);
    setName('');
    setSelectedTags([]);
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
          <DialogTitle>Nueva Actriz</DialogTitle>
        </DialogHeader>
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
              {isLoading ? <Spinner className="h-4 w-4" /> : 'Crear'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

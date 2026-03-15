import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Checkbox } from '@/common/components/ui/checkbox';
import { Spinner } from '@/common/components/ui/spinner';
import { TagType } from '@/common/enums/tag.enum';
import { useGetTags } from '../hooks/useGetTags.hook';
import type { ActressAdult } from '../models/actressAdult.model';

interface AddVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentActressId: number;
  actresses: ActressAdult[];
  onSave: (source: string, videoUrl: string, actressIds: number[], tagIds: number[]) => void;
}

const detectVideoSource = (url: string): string => {
  if (!url) return 'pornhub';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('xvideos')) return 'xvideos';
  if (lowerUrl.includes('pornhub')) return 'pornhub';
  return 'pornhub'; // default
};

export const AddVideoDialog = ({
  open,
  onOpenChange,
  currentActressId,
  actresses,
  onSave,
}: AddVideoDialogProps) => {
  const [source, setSource] = useState('pornhub');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedActresses, setSelectedActresses] = useState<number[]>([currentActressId]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const { data: tags, isLoading: isLoadingTags } = useGetTags(TagType.VideoAdult);

  const handleVideoUrlChange = (value: string) => {
    setVideoUrl(value);
    // Auto-detect source from URL
    const detectedSource = detectVideoSource(value);
    setSource(detectedSource);
  };

  const handleSave = () => {
    if (!videoUrl.trim()) return;
    onSave(source, videoUrl, selectedActresses, selectedTags);
    setVideoUrl('');
    setSelectedActresses([currentActressId]);
    setSelectedTags([]);
  };

  const toggleActress = (id: number) => {
    if (selectedActresses.includes(id)) {
      setSelectedActresses(selectedActresses.filter(aid => aid !== id));
    } else {
      setSelectedActresses([...selectedActresses, id]);
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Fuente</label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pornhub">Pornhub</SelectItem>
                <SelectItem value="xvideos">Xvideos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">URL del Video</label>
            <Input
              placeholder="https://..."
              value={videoUrl}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Actrices (selecciona múltiples)</label>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded p-2">
              {actresses.map((actress) => (
                <div
                  key={actress.id}
                  onClick={() => toggleActress(actress.id)}
                  className={`p-2 rounded cursor-pointer text-sm ${
                    selectedActresses.includes(actress.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {actress.name}
                </div>
              ))}
            </div>
          </div>

          {isLoadingTags ? (
            <div className="flex justify-center py-4">
              <Spinner className="h-6 w-6" />
            </div>
          ) : tags && tags.length > 0 ? (
            <div>
              <label className="text-sm font-medium mb-2 block">Tags del Video</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded p-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`video-tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={() => toggleTag(tag.id)}
                    />
                    <label
                      htmlFor={`video-tag-${tag.id}`}
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
            <Button onClick={handleSave} disabled={!videoUrl.trim() || selectedActresses.length === 0}>
              Agregar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

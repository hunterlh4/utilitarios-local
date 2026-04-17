import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Spinner } from '@/common/components/ui/spinner';
import { useGetTags } from '../hooks/useGetTags.hook';
import type { ActressAdult, VideoAdult } from '../models/actressAdult.model';

interface EditVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: VideoAdult | null;
  actresses: ActressAdult[];
  onSave: (videoId: number, actressIds: number[], tagIds: number[]) => void;
  currentActressId?: number;
}

export const EditVideoDialog = ({
  open,
  onOpenChange,
  video,
  actresses,
  onSave,
  currentActressId,
}: EditVideoDialogProps) => {
  const [selectedActresses, setSelectedActresses] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: tags, isLoading: isLoadingTags } = useGetTags(6); // 6 = VideoAdult

  useEffect(() => {
    if (video && tags) {
      const actressIds = video.actresses.map(a => a.id);
      if (currentActressId && !actressIds.includes(currentActressId)) {
        actressIds.push(currentActressId);
      }
      setSelectedActresses(actressIds);
      // Convertir nombres de tags a IDs
      const tagIds = video.tags
        .map(tagName => tags.find(t => t.name === tagName)?.id)
        .filter((id): id is number => id !== undefined);
      setSelectedTags(tagIds);
    }
  }, [video, tags, currentActressId]);

  const handleSave = async () => {
    if (!video || selectedActresses.length === 0) return;
    setIsLoading(true);
    await onSave(video.id, selectedActresses, selectedTags);
    setIsLoading(false);
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

  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">URL:</p>
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline break-all"
            >
              {video.videoUrl}
            </a>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={selectedActresses.length === 0 || isLoading}>
              {isLoading ? <Spinner className="h-4 w-4" /> : 'Guardar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

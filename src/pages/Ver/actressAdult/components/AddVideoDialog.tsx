import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import type { ActressAdult } from '../models/actressAdult.model';

interface AddVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentActressId: number;
  actresses: ActressAdult[];
  onSave: (source: string, videoUrl: string, actressIds: number[]) => void;
}

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

  const handleSave = () => {
    if (!videoUrl.trim()) return;
    onSave(source, videoUrl, selectedActresses);
    setVideoUrl('');
    setSelectedActresses([currentActressId]);
  };

  const toggleActress = (id: number) => {
    if (selectedActresses.includes(id)) {
      setSelectedActresses(selectedActresses.filter(aid => aid !== id));
    } else {
      setSelectedActresses([...selectedActresses, id]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
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
              onChange={(e) => setVideoUrl(e.target.value)}
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

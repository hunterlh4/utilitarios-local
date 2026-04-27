import { useEffect, useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import type { YouTube } from '../models/youtube.model';
import type { CreateYouTubeDto, UpdateYouTubeDto } from '../models/youtube-request.dto';

const CATEGORY_OPTIONS = [
  { value: '1', label: 'Anime' },
  { value: '2', label: 'Serie' },
  { value: '3', label: 'Película' },
  { value: '4', label: 'Shorts' },
] as const;

type YouTubeFormState = {
  url: string;
  category: '1' | '2' | '3' | '4';
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: YouTube | null;
  onSave: (data: CreateYouTubeDto | UpdateYouTubeDto) => Promise<void>;
};

const emptyForm: YouTubeFormState = {
  url: '',
  category: '1',
};

export const YouTubeFormDialog = ({ open, onOpenChange, item, onSave }: Props) => {
  const isEdit = !!item;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<YouTubeFormState>(emptyForm);

  useEffect(() => {
    if (item) {
      setForm({
        url: item.url ?? '',
        category: item.category,
      });
      return;
    }

    setForm(emptyForm);
  }, [item, open]);

  const setField = <K extends keyof YouTubeFormState>(key: K, value: YouTubeFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload: CreateYouTubeDto | UpdateYouTubeDto = {
        url: form.url.trim(),
        category: form.category,
      };

      await onSave(payload);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar YouTube' : 'Agregar YouTube'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3">
          <Input placeholder="URL de YouTube" value={form.url} onChange={(e) => setField('url', e.target.value)} />
          <Select value={form.category} onValueChange={(value) => setField('category', value as YouTubeFormState['category'])}>
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!form.url.trim() || saving}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

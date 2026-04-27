import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Spinner } from '@/common/components/ui/spinner';
import { useGetTags } from '@/common/hooks/useGetTags.hook';
import { TagType } from '@/common/enums/tag-type.enum';
import { useUploadProjectImages } from '../hooks/useUploadProjectImages.hook';
import { useDeleteProjectMedia } from '../hooks/useDeleteProjectMedia.hook';
import { useAddProjectImageUrl } from '../hooks/useAddProjectImageUrl.hook';
import type { Project, ProjectDetail } from '../models/project.model';
import type { CreateProjectDto, UpdateProjectDto } from '../models/project-request.dto';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Project | null;
  detail?: ProjectDetail | null;   // detalle completo con media y links
  onSave: (data: CreateProjectDto | UpdateProjectDto) => Promise<void>;
  isSaving?: boolean;
}

const EMPTY_FORM = { name: '', description: '', url: '', tagIds: [] as number[] };

export const ProjectFormDialog = ({ open, onOpenChange, editing, detail, onSave, isSaving }: Props) => {
  const [form, setForm] = useState(EMPTY_FORM);
  // Para crear: listas de URLs de imágenes y links
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [links, setLinks] = useState<string[]>(['']);
  // Para editar: nueva URL de imagen a agregar
  const [newImageUrl, setNewImageUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: tags, isLoading: isLoadingTags } = useGetTags(TagType.Project);
  const uploadImages = useUploadProjectImages();
  const deleteMedia = useDeleteProjectMedia();
  const addImageUrl = useAddProjectImageUrl();

  useEffect(() => {
    if (!open) return;
    if (editing) {
      const tagIds = tags?.filter((t) => editing.tags?.includes(t.name)).map((t) => t.id) ?? [];
      setForm({ name: editing.name, description: editing.description ?? '', url: editing.url ?? '', tagIds });
      setNewImageUrl('');
    } else {
      setForm(EMPTY_FORM);
      setImageUrls(['']);
      setLinks(['']);
    }
  }, [open, editing, tags]);

  const toggleTag = (id: number) =>
    setForm((f) => ({
      ...f,
      tagIds: f.tagIds.includes(id) ? f.tagIds.filter((t) => t !== id) : [...f.tagIds, id],
    }));

  // Helpers para listas en crear
  const setListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, i: number, val: string) =>
    setter((prev) => { const next = [...prev]; next[i] = val; return next; });
  const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((prev) => [...prev, '']);
  const removeListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, i: number) =>
    setter((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (editing) {
      await onSave({ name: form.name.trim(), description: form.description || undefined, url: form.url || undefined, tagIds: form.tagIds } satisfies UpdateProjectDto);
    } else {
      const validImages = imageUrls.filter((u) => u.trim());
      const validLinks = links.filter((l) => l.trim());
      await onSave({
        name: form.name.trim(),
        description: form.description || undefined,
        url: form.url || undefined,
        tagIds: form.tagIds,
        imageUrls: validImages.length ? validImages : undefined,
        links: validLinks.length ? validLinks : undefined,
      } satisfies CreateProjectDto);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !editing) return;
    try {
      await uploadImages.mutateAsync({ id: editing.id, files });
      toast.success(`${files.length} imagen${files.length > 1 ? 'es' : ''} subida${files.length > 1 ? 's' : ''}`);
    } catch {
      toast.error('Error al subir imágenes');
    } finally {
      e.target.value = '';
    }
  };

  const handleAddImageUrl = async () => {
    if (!newImageUrl.trim() || !editing) return;
    try {
      await addImageUrl.mutateAsync({ id: editing.id, url: newImageUrl.trim() });
      toast.success('Imagen agregada');
      setNewImageUrl('');
    } catch {
      toast.error('Error al agregar imagen');
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    try {
      await deleteMedia.mutateAsync(mediaId);
      toast.success('Imagen eliminada');
    } catch {
      toast.error('Error al eliminar imagen');
    }
  };

  const currentMedia = detail?.media ?? [];
  const currentLinks = detail?.links ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar proyecto' : 'Nuevo proyecto'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Nombre *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Descripción" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Input placeholder="URL del proyecto" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} />

          {/* Tags */}
          <div>
            <p className="text-sm font-medium mb-1.5">Tags</p>
            {isLoadingTags ? <Spinner className="h-4 w-4" /> : tags && tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto border rounded p-2">
                {tags.map((tag) => (
                  <div key={tag.id} onClick={() => toggleTag(tag.id)}
                    className={`px-2 py-1 rounded text-xs cursor-pointer transition-colors ${form.tagIds.includes(tag.id) ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                    {tag.name}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-muted-foreground">No hay tags de tipo Proyecto.</p>}
          </div>

          {/* Imágenes */}
          <div>
            <p className="text-sm font-medium mb-1.5">Imágenes</p>
            {editing ? (
              <>
                {/* Imágenes existentes */}
                {currentMedia.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    {currentMedia.map((m, idx) => (
                      <div key={m.id} className="relative group aspect-video rounded overflow-hidden bg-muted">
                        <img src={m.url} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1 rounded">portada</span>
                        )}
                        <button
                          onClick={() => handleDeleteMedia(m.id)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Agregar por URL */}
                <div className="flex gap-1.5 mb-1.5">
                  <Input
                    placeholder="URL de imagen"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    onKeyDown={(e) => e.key === 'Enter' && void handleAddImageUrl()}
                  />
                  <Button size="sm" variant="outline" onClick={handleAddImageUrl} disabled={!newImageUrl.trim() || addImageUrl.isPending}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {/* Subir archivo */}
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={uploadImages.isPending}>
                  {uploadImages.isPending ? <Spinner className="h-4 w-4 mr-1" /> : <Upload className="h-3.5 w-3.5 mr-1" />}
                  Subir desde archivo
                </Button>
              </>
            ) : (
              /* Crear: solo URLs */
              <div className="space-y-1.5">
                {imageUrls.map((url, i) => (
                  <div key={i} className="flex gap-1.5">
                    <Input placeholder={`URL imagen ${i + 1}${i === 0 ? ' (portada)' : ''}`} value={url}
                      onChange={(e) => setListItem(setImageUrls, i, e.target.value)}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0" />
                    {imageUrls.length > 1 && (
                      <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={() => removeListItem(setImageUrls, i)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addListItem(setImageUrls)} className="w-full">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Agregar imagen
                </Button>
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-medium mb-1.5">Links</p>
            {editing ? (
              /* Editar: mostrar links existentes (solo lectura por ahora) */
              currentLinks.length > 0 ? (
                <div className="space-y-1">
                  {currentLinks.map((l) => (
                    <div key={l.id} className="flex items-center gap-1.5 text-sm">
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate flex-1">
                        {l.name || l.url}
                      </a>
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-muted-foreground">Sin links.</p>
            ) : (
              <div className="space-y-1.5">
                {links.map((link, i) => (
                  <div key={i} className="flex gap-1.5">
                    <Input placeholder={`Link ${i + 1}`} value={link}
                      onChange={(e) => setListItem(setLinks, i, e.target.value)}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0" />
                    {links.length > 1 && (
                      <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={() => removeListItem(setLinks, i)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addListItem(setLinks)} className="w-full">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Agregar link
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving || !form.name.trim()}>
            {isSaving ? <Spinner className="h-4 w-4 mr-1" /> : null}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetAllComics } from './hooks/useGetAllComics.hook';
import { useCreateComic } from './hooks/useCreateComic.hook';
import { useUpdateComic } from './hooks/useUpdateComic.hook';
import { useDeleteComic } from './hooks/useDeleteComic.hook';
import { useUploadImage } from './hooks/useUploadImage.hook';
import { useExportComic } from './hooks/useExportComic.hook';
import { useImportComic } from './hooks/useImportComic.hook';
import type { Comic } from './models/comic.model';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Spinner } from '@/common/components/ui/spinner';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/common/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { ChevronDown, Download, Image as ImageIcon, Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { downloadBase64File } from '@/common/lib/download-file';
import { storageHelper } from '@/common/lib/storage.helper';

const EMPTY_FORM = { name: '', image: '', url: '', category: '' };

const PRESET_CATEGORIES = [
  'Naruto', 'Pokemon', 'Dragon Ball', 'One Piece', 'Bleach', 'Attack on Titan',
  'Demon Slayer', 'My Hero Academia', 'Fairy Tail', 'Hunter x Hunter',
  'Fullmetal Alchemist', 'Death Note', 'Tokyo Ghoul', 'Sword Art Online',
  'Black Clover', 'Boruto', 'JoJo', 'Chainsaw Man', 'Spy x Family',
  'Jujutsu Kaisen', 'Marvel', 'DC', 'Manhwa', 'Manhua', 'Otro',
];

const CategoryCombobox = ({
  value,
  onChange,
  extraOptions,
}: {
  value: string;
  onChange: (v: string) => void;
  extraOptions: string[];
}) => {
  const [search, setSearch] = useState('');

  const allOptions = useMemo(() =>
    Array.from(new Set([...PRESET_CATEGORIES, ...extraOptions])).sort()
  , [extraOptions]);

  const filtered = allOptions.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) setSearch(''); }}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between font-normal">
          <span className={value ? '' : 'text-muted-foreground'}>{value || 'Seleccionar categoría...'}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-1" align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
        <div className="p-1 pb-1.5">
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <div className="max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">Sin resultados</p>
          ) : (
            filtered.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => onChange(opt)}
                className={value === opt ? 'bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground' : ''}
              >
                {opt}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ComicPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [pendingReplace, setPendingReplace] = useState<{ file: File; refId: number } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [hideTitles, setHideTitles] = useState(() => storageHelper.getHideTitles());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingComic, setEditingComic] = useState<Comic | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Comic | null>(null);

  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: comics, isLoading, error, refetch } = useGetAllComics();
  const createComic = useCreateComic();
  const updateComic = useUpdateComic();
  const deleteComic = useDeleteComic();
  const uploadImage = useUploadImage();
  const exportComic = useExportComic();
  const importComic = useImportComic();

  // Categories from existing data (for filter pills + combobox extra options)
  const existingCategories = useMemo(() => {
    if (!comics) return [];
    return Array.from(new Set(comics.map((c) => c.category).filter(Boolean))).sort();
  }, [comics]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (comics ?? []).filter(
      (c) =>
        (!q || c.name.toLowerCase().includes(q)) &&
        (!categoryFilter || c.category === categoryFilter)
    );
  }, [comics, searchQuery, categoryFilter]);

  // Paste image
  const uploadPastedImage = useCallback(async (file: File, refId: number) => {
    try {
      await uploadImage.mutateAsync({ file, refId });
      await refetch();
    } catch {
      toast.error('Error al subir la imagen');
    }
  }, [refetch, uploadImage]);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (!hoveredId) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;
        const hoveredComic = comics?.find((c) => c.id === hoveredId);
        if (hoveredComic?.image) {
          setPendingReplace({ file: blob, refId: hoveredId });
          return;
        }
        await uploadPastedImage(blob, hoveredId);
        break;
      }
    }
  }, [hoveredId, comics, uploadPastedImage]);

  useEffect(() => {
    const listener = (e: Event) => void handlePaste(e as ClipboardEvent);
    document.addEventListener('paste', listener);
    return () => document.removeEventListener('paste', listener);
  }, [handlePaste]);

  const openCreate = () => {
    setEditingComic(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (comic: Comic) => {
    setEditingComic(comic);
    setForm({ name: comic.name, image: comic.image, url: comic.url, category: comic.category });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('El nombre es requerido'); return; }
    try {
      if (editingComic) {
        await updateComic.mutateAsync({ id: editingComic.id, data: form });
        toast.success('Comic actualizado');
      } else {
        await createComic.mutateAsync(form);
        toast.success('Comic creado');
      }
      setDialogOpen(false);
    } catch {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteComic.mutateAsync(deleteTarget.id);
      toast.success('Comic eliminado');
      setDeleteTarget(null);
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const file = await exportComic.mutateAsync();
      downloadBase64File(file.base64, file.fileName || 'comic.xlsx');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      await importComic.mutateAsync(file);
      await refetch();
    } finally {
      e.target.value = '';
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-2 p-1">
        <input ref={importInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImportFile} />
        <Input
          placeholder="Buscar comic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="button" size="icon" onClick={openCreate}>
          <Plus className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="icon" disabled={isExporting || isImporting}>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExport} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" /> Exportar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => importInputRef.current?.click()} disabled={isImporting}>
              <Upload className="h-4 w-4 mr-2" /> Importar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => {
            const newValue = storageHelper.toggleHideTitles();
            setHideTitles(newValue);
          }}
          title={hideTitles ? 'Mostrar títulos' : 'Ocultar títulos'}
        >
          {hideTitles ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {/* Category filter */}
      {existingCategories.length > 0 && (
        <div className="bg-muted/30 rounded-md p-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs font-medium mr-1">Categoría:</p>
            {existingCategories.map((cat) => (
              <Button
                key={cat}
                type="button"
                variant={categoryFilter === cat ? 'default' : 'outline'}
                size="sm"
                className="h-6 rounded-full px-2 text-xs"
                onClick={() => setCategoryFilter((prev) => (prev === cat ? '' : cat))}
              >
                {cat}
              </Button>
            ))}
            {categoryFilter && (
              <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setCategoryFilter('')}>
                Limpiar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div>
      ) : error ? (
        <p className="text-center text-red-500 py-8">Error al cargar los comics</p>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
          {filtered.map((comic) => (
            <Card
              key={comic.id}
              className="overflow-hidden flex flex-col border-0 shadow-none rounded-none"
              onMouseEnter={() => setHoveredId(comic.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <CardHeader className="p-0">
                <div className="aspect-2/3 w-full overflow-hidden bg-muted relative">
                  {/* Click en imagen abre URL */}
                  <a
                    href={comic.url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={comic.url ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
                    onClick={(e) => !comic.url && e.preventDefault()}
                  >
                    {comic.image ? (
                      <img
                        src={comic.image}
                        alt={comic.name}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'w-full h-full flex flex-col items-center justify-center bg-muted gap-2 p-4';
                            placeholder.innerHTML = `
                              <svg class="h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span class="text-xs text-muted-foreground text-center">Imagen no disponible</span>
                            `;
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </a>
                  {hoveredId === comic.id && (
                    <div className="absolute top-1 right-1 flex gap-1">
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-6 w-6"
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(comic); }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              {!hideTitles && (
                <CardContent className="p-2">
                  <CardTitle
                    className="text-sm line-clamp-2 text-center cursor-pointer hover:underline"
                    onClick={() => openEdit(comic)}
                  >
                    {comic.name}
                  </CardTitle>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">No hay comics</p>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          onPaste={async (e) => {
            if (!editingComic) return;
            const items = e.clipboardData?.items;
            if (!items) return;
            for (let i = 0; i < items.length; i++) {
              if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const blob = items[i].getAsFile();
                if (!blob) continue;
                try {
                  await uploadImage.mutateAsync({ file: blob, refId: editingComic.id });
                  await refetch();
                  const updatedComic = comics?.find((c) => c.id === editingComic.id);
                  if (updatedComic) {
                    setForm((f) => ({ ...f, image: updatedComic.image }));
                  }
                } catch {
                  toast.error('Error al subir la imagen');
                }
                break;
              }
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{editingComic ? 'Editar comic' : 'Nuevo comic'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Nombre *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <div className="space-y-1">
              <Input
                placeholder="URL de imagen"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              />
              {editingComic && (
                <p className="text-xs text-muted-foreground">
                  Tip: Pega una imagen (Ctrl+V) para subirla a imgbb
                </p>
              )}
            </div>
            <Input
              placeholder="URL del comic"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            />
            <CategoryCombobox
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
              extraOptions={existingCategories}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={createComic.isPending || updateComic.isPending}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replace image confirm */}
      <Dialog open={!!pendingReplace} onOpenChange={(open) => !open && setPendingReplace(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reemplazar imagen</DialogTitle></DialogHeader>
          <p>Este comic ya tiene imagen. ¿Deseas reemplazarla?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingReplace(null)}>Cancelar</Button>
            <Button onClick={async () => {
              if (!pendingReplace) return;
              await uploadPastedImage(pendingReplace.file, pendingReplace.refId);
              setPendingReplace(null);
            }}>
              Reemplazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Eliminar comic</DialogTitle></DialogHeader>
          <p>¿Eliminar <strong>{deleteTarget?.name}</strong>? Esta acción no se puede deshacer.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteComic.isPending}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

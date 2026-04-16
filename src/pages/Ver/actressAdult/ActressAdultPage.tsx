import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllActressAdult } from './hooks/useGetAllActressAdult.hook';
import { useDeleteActressAdult } from './hooks/useDeleteActressAdult.hook';
import { useCreateActressAdult } from './hooks/useCreateActressAdult.hook';
import { useUpdateActressAdult } from './hooks/useUpdateActressAdult.hook';
import { useUpdateLinks } from './hooks/useUpdateLinks.hook';
import { useUploadImage } from './hooks/useUploadImage.hook';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Search, Plus, Trash2, Edit, Link as LinkIcon, Image as ImageIcon, ChevronDown, Upload, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu';
import { downloadBase64File } from '@/common/lib/download-file';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Label } from '@/common/components/ui/label';
import { CreateActressDialog } from './components/CreateActressDialog';
import { EditActressDialog } from './components/EditActressDialog';
import { BulkCreateActressDialog } from './components/BulkCreateActressDialog';
import { actressAdultService } from './services/actressAdult.service';
import type { ActressAdult } from './models/actressAdult.model';

type ActressAdultWithLinks = ActressAdult & {
  links?: Array<{ id: number; url: string }>;
};

interface ActressLinksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actress: ActressAdultWithLinks | null;
  onSave: (actressId: number, links: string[]) => void;
}

const ActressLinksDialog = ({ open, onOpenChange, actress, onSave }: ActressLinksDialogProps) => {
  const [links, setLinks] = useState<string[]>(() => actress?.links?.map((link) => link.url) ?? []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (actress) {
      const filteredLinks = links.filter((link) => link.trim() !== '');
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
                <Button type="button" size="icon" variant="destructive" onClick={() => removeLink(index)}>
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
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const ActressAdultPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkCreateDialogOpen, setBulkCreateDialogOpen] = useState(false);
  const [linksDialogOpen, setLinksDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingActress, setEditingActress] = useState<ActressAdultWithLinks | null>(null);
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [hoveredActressId, setHoveredActressId] = useState<number | null>(null);
  const [pendingReplace, setPendingReplace] = useState<{ file: File; refId: number } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: actresses, isLoading, error, refetch } = useGetAllActressAdult();
  const deleteActress = useDeleteActressAdult();
  const createActress = useCreateActressAdult();
  const updateActress = useUpdateActressAdult();
  const updateLinks = useUpdateLinks();
  const uploadImage = useUploadImage();

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const file = await actressAdultService.exportExcel();
      downloadBase64File(file.base64, file.fileName || 'actress-adult.xlsx');
      toast.success('Exportacion completada');
    } catch {
      toast.error('No se pudo exportar el archivo');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await actressAdultService.importExcel(file);
      await refetch();
      toast.success(
        `Importacion lista. Creados: ${result.created}, Actualizados: ${result.updated}, Sin cambios: ${result.skipped}, Invalidos: ${result.invalid}`
      );
    } catch {
      toast.error('No se pudo importar el archivo');
    } finally {
      event.target.value = '';
      setIsImporting(false);
    }
  };

  const uploadPastedImage = useCallback(async (file: File, refId: number) => {
    try {
      await uploadImage.mutateAsync({ file, refId });
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al subir la imagen');
    }
  }, [uploadImage]);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (!hoveredActressId) return;

    const hoveredActress = actresses?.find((actress) => actress.id === hoveredActressId);

    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;

        if (hoveredActress?.image) {
          setPendingReplace({ file: blob, refId: hoveredActressId });
          return;
        }

        await uploadPastedImage(blob, hoveredActressId);
        break;
      }
    }
  }, [actresses, hoveredActressId, uploadPastedImage]);

  useEffect(() => {
    const pasteListener = (event: Event) => {
      void handlePaste(event as ClipboardEvent);
    };

    document.addEventListener('paste', pasteListener);
    return () => {
      document.removeEventListener('paste', pasteListener);
    };
  }, [handlePaste]);

  const handleCreateActress = async (name: string, tagIds: number[]) => {
    try {
      await createActress.mutateAsync({ name, tagIds });
      toast.success('Actriz creada correctamente');

      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error al crear actriz:', error);
      toast.error('Error al crear la actriz');
    }
  };

  const handleBulkCreateActresses = async (names: string[]) => {
    try {
      for (const name of names) {
        try {
          await createActress.mutateAsync({ name, tagIds: [] });
        } catch (error) {
          console.error(`Error al crear actriz "${name}":`, error);
          toast.error(`Error al crear la actriz "${name}"`);
        }
      }
      toast.success('Actrices creadas correctamente');
      setBulkCreateDialogOpen(false);
    } catch (error) {
      console.error('Error en creación en lote:', error);
      toast.error('Error al crear las actrices');
    }
  };

  const handleEditActress = async (
    id: number,
    name: string,
    tagIds: number[]
  ) => {
    try {
      await updateActress.mutateAsync({ id, name, tagIds });

      toast.success('Actriz actualizada correctamente');
      setEditDialogOpen(false);
      setEditingActress(null);
    } catch (error) {
      console.error('Error al actualizar actriz:', error);
      toast.error('Error al actualizar la actriz');
    }
  };

  const handleEdit = (actress: ActressAdult) => {
    setEditingActress(actress);
    setEditDialogOpen(true);
  };

  const handleEditLinks = (actress: ActressAdultWithLinks) => {
    setEditingActress(actress);
    setLinksDialogOpen(true);
  };

  const handleSaveLinks = async (actressId: number, links: string[]) => {
    try {
      await updateLinks.mutateAsync({ id: actressId, links });
      toast.success('Enlaces actualizados correctamente');
      setLinksDialogOpen(false);
      setEditingActress(null);
    } catch (error) {
      console.error('Error al actualizar enlaces:', error);
      toast.error('Error al actualizar los enlaces');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta actriz?')) {
      return;
    }

    try {
      await deleteActress.mutateAsync(id);
      toast.success('Actriz eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar la actriz');
    }
  };

  const handleUploadImage = (actress: ActressAdult) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        await uploadImage.mutateAsync({ file, refId: actress.id });
        toast.success('Imagen subida correctamente');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al subir la imagen');
      }
    };
    input.click();
  };

  const handleOpenDialog = () => {
    setEditingActress(null);
    setCreateDialogOpen(true);
  };

  const toggleTagFilter = (tagName: string) => {
    setSelectedTagFilters((prev) =>
      prev.includes(tagName) ? prev.filter((tag) => tag !== tagName) : [...prev, tagName]
    );
  };

  const availableTags = useMemo(() => {
    if (!actresses) return [];
    const tagSet = new Set<string>();
    actresses.forEach((actress) => {
      actress.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [actresses]);

  const filteredActresses = useMemo(() => {
    if (!actresses) return [];

    return actresses.filter((actress) => {
      const matchesSearch =
        actress.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (actress.tags && actress.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesTags =
        selectedTagFilters.length === 0 ||
        selectedTagFilters.every((filterTag) => actress.tags?.includes(filterTag));

      return matchesSearch && matchesTags;
    });
  }, [actresses, searchQuery, selectedTagFilters]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-2 mb-1 flex-wrap px-1 pt-1">
        <input
          ref={importInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleImportExcel}
        />

        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre o tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex items-center overflow-hidden rounded-md">
          <Button onClick={handleOpenDialog} className="rounded-none border-0 bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Crear
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                disabled={isExporting || isImporting}
                className="rounded-none border-0 border-l border-primary-foreground/25 px-2 bg-green-600 hover:bg-green-700"
                title="Importar/Exportar Excel"
              >
                {isExporting || isImporting ? <Spinner className="h-4 w-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1.5 bg-primary">
              <DropdownMenuItem
                onClick={handleExportExcel}
                className="h-9 cursor-pointer rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground"
              >
                <Download className="mr-2 h-4 w-4" /> Exportar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleImportClick}
                className="mt-1 h-9 cursor-pointer rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground"
              >
                <Upload className="mr-2 h-4 w-4" /> Importar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setBulkCreateDialogOpen(true)}
                className="mt-1 h-9 cursor-pointer rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" /> Importar en lote
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {availableTags.length > 0 && (
        <div className="px-1 mb-1">
          <div className="bg-muted/30 rounded-lg p-2">
            <p className="text-xs font-medium mb-1.5">Filtrar por tags:</p>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => (
                <div
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`px-2 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                    selectedTagFilters.includes(tag)
                      ? 'bg-purple-500 text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {tag}
                </div>
              ))}
            </div>
            {selectedTagFilters.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedTagFilters([])}
                className="mt-1.5 h-6 text-xs"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-1 pb-1">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Error al cargar las actrices</p>
          </div>
        ) : filteredActresses && filteredActresses.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
            {filteredActresses.map((actress) => (
              <div
                key={actress.id}
                className="relative w-full group"
                style={{ paddingBottom: '150%' }}
                onMouseEnter={() => setHoveredActressId(actress.id)}
                onMouseLeave={() => setHoveredActressId(null)}
              >
                <Button
                  size="icon"
                  className="absolute top-2 left-2 h-7 w-7 z-10 bg-cyan-600 hover:bg-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditLinks(actress as ActressAdultWithLinks);
                  }}
                >
                  <LinkIcon className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  className="absolute top-2 left-10 h-7 w-7 z-10 bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(actress);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-7 w-7 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDelete(actress.id);
                  }}
                  disabled={deleteActress.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>

                <div
                  className="absolute inset-0 cursor-pointer transition-all hover:opacity-90"
                  onClick={() => navigate(`/ver/actress-adult/${actress.id}`)}
                >
                  {actress.image ? (
                    <img
                      src={actress.image}
                      alt={actress.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 space-y-1 z-10">
                  <div className="flex items-center justify-center gap-2">
                    <p
                      className="font-medium text-sm text-white text-center truncate cursor-pointer hover:text-blue-300 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadImage(actress);
                      }}
                    >
                      {actress.name}
                    </p>
                  </div>
                  {(actress as ActressAdultWithLinks).links && (actress as ActressAdultWithLinks).links!.length > 0 && (
                    <div className="flex gap-1 justify-center">
                      {(actress as ActressAdultWithLinks).links!.slice(0, 3).map((link, index) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-300 hover:text-blue-200 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          [{index + 1}]
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {searchQuery || selectedTagFilters.length > 0
              ? 'No se encontraron actrices con los filtros aplicados'
              : 'No hay actrices registradas'}
          </p>
        )}
      </div>

      <CreateActressDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleCreateActress}
      />

      <EditActressDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setEditingActress(null);
          }
        }}
        actressId={editingActress?.id ?? null}
        onSave={handleEditActress}
      />

      <ActressLinksDialog
        key={`${editingActress?.id ?? 'none'}-${linksDialogOpen ? 'open' : 'closed'}`}
        open={linksDialogOpen}
        onOpenChange={setLinksDialogOpen}
        actress={editingActress}
        onSave={handleSaveLinks}
      />

      <BulkCreateActressDialog
        open={bulkCreateDialogOpen}
        onOpenChange={setBulkCreateDialogOpen}
        onCreateActresses={handleBulkCreateActresses}
      />

      <Dialog open={!!pendingReplace} onOpenChange={(open) => !open && setPendingReplace(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reemplazar imagen</DialogTitle>
          </DialogHeader>
          <p>Esta actriz ya tiene imagen. ¿Deseas reemplazarla?</p>
          <DialogFooter>
            <Button variant="outline" className="focus-visible:ring-0 focus-visible:ring-offset-0" onClick={() => setPendingReplace(null)}>
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (!pendingReplace) return;
                await uploadPastedImage(pendingReplace.file, pendingReplace.refId);
                setPendingReplace(null);
              }}
            >
              Reemplazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

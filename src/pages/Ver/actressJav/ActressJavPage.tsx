import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllActresses } from './hooks/useGetAllActresses.hook';
import { useDeleteActress } from './hooks/useDeleteActress.hook';
import { useAddActress } from './hooks/useAddActress.hook';
import { useUpdateActress } from './hooks/useUpdateActress.hook';
import { useUpdateActressLinks } from './hooks/useUpdateActressLinks.hook';
import { useUploadImage } from './hooks/useUploadImage.hook';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Search, Plus, Trash2, Edit, Link as LinkIcon, Image as ImageIcon, ChevronDown, Upload, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu';
import { downloadBase64File } from '@/common/lib/download-file';
import { toast } from 'sonner';
import { ActressDialog } from './components/form';
import { ActressLinksDialog } from './components/ActressLinksDialog';
import { BulkCreateActressDialog } from './components/BulkCreateActressDialog';
import { actressJavService } from './services/actressJav.service';
import type { ActressJav } from './models/actress.model';

type ActressJavForm = ActressJav & { tagIds?: number[] };

export const ActressJavPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkCreateDialogOpen, setBulkCreateDialogOpen] = useState(false);
  const [linksDialogOpen, setLinksDialogOpen] = useState(false);
  const [editingActress, setEditingActress] = useState<ActressJav | null>(null);
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [hoveredActressId, setHoveredActressId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: actresses, isLoading, error, refetch } = useGetAllActresses();
  const deleteActress = useDeleteActress();
  const addActress = useAddActress();
  const updateActress = useUpdateActress();
  const updateActressLinks = useUpdateActressLinks();
  const uploadImage = useUploadImage();

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const file = await actressJavService.exportExcel();
      downloadBase64File(file.base64, file.fileName || 'actress-jav.xlsx');
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
      const result = await actressJavService.importExcel(file);
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

  // Manejar paste global
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (!hoveredActressId) return;

    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;

        try {
          await uploadImage.mutateAsync({
            file: blob,
            refId: hoveredActressId,
          });
          toast.success('Imagen subida correctamente');
        } catch (error) {
          console.error('Error:', error);
          toast.error('Error al subir la imagen');
        }
        break;
      }
    }
  }, [hoveredActressId, uploadImage]);

  // Agregar y remover listener de paste
  useEffect(() => {
    const pasteListener = (event: Event) => {
      void handlePaste(event as ClipboardEvent);
    };

    document.addEventListener('paste', pasteListener);
    return () => {
      document.removeEventListener('paste', pasteListener);
    };
  }, [handlePaste]);

  const handleSave = async (actress: ActressJav) => {
    const actressForm = actress as ActressJavForm;
    try {
      if (editingActress) {
        const tagIds = actressForm.tagIds || [];
        await updateActress.mutateAsync({
          id: actress.id,
          data: {
            name: actress.name,
            tagIds: tagIds,
          },
        });
        toast.success('Actriz actualizada correctamente');
      } else {
        const tagIds = actressForm.tagIds || [];
        await addActress.mutateAsync({
          name: actress.name,
          tagIds: tagIds,
        });
        toast.success('Actriz agregada correctamente');
      }
      setDialogOpen(false);
      setEditingActress(null);
    } catch (error: unknown) {
      console.error('Error al guardar:', error);
      
      // Mostrar mensaje específico si viene del backend
      const maybeApiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage = maybeApiError.response?.data?.message || maybeApiError.message;
      
      if (errorMessage && errorMessage.includes('Ya existe')) {
        toast.error(errorMessage);
      } else {
        toast.error(editingActress ? 'Error al actualizar la actriz' : 'Error al agregar la actriz');
      }
    }
  };

  const handleSaveLinks = async (actressId: number, links: string[]) => {
    try {
      await updateActressLinks.mutateAsync({ id: actressId, links });
      toast.success('Enlaces actualizados correctamente');
      setLinksDialogOpen(false);
      setEditingActress(null);
    } catch (error) {
      console.error('Error al actualizar enlaces:', error);
      toast.error('Error al actualizar los enlaces');
    }
  };

  const handleEdit = (actress: ActressJav) => {
    setEditingActress(actress);
    setDialogOpen(true);
  };

  const handleEditLinks = (actress: ActressJav) => {
    setEditingActress(actress);
    setLinksDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta actriz? Esto no eliminará los JAVs asociados.')) {
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

  const handleUploadImage = (actress: ActressJav) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        await uploadImage.mutateAsync({
          file,
          refId: actress.id,
        });
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
    setDialogOpen(true);
  };

  const handleBulkCreateActresses = async (names: string[]) => {
    try {
      for (const name of names) {
        try {
          await addActress.mutateAsync({
            name,
            tagIds: [],
          });
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

  const toggleTagFilter = (tagName: string) => {
    setSelectedTagFilters(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  const availableTags = useMemo(() => {
    if (!actresses) return [];
    const tagSet = new Set<string>();
    actresses.forEach(actress => {
      actress.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [actresses]);

  const filteredActresses = useMemo(() => {
    if (!actresses) return [];

    return actresses.filter((actress) => {
      const matchesSearch =
        actress.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (actress.tags && actress.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesTags = selectedTagFilters.length === 0 ||
        selectedTagFilters.every(filterTag => actress.tags?.includes(filterTag));

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
        <Button onClick={handleOpenDialog} size="icon" className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" disabled={isExporting || isImporting} title="Importar/Exportar Excel">
              {isExporting || isImporting ? <Spinner className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 p-1.5">
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
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={() => setBulkCreateDialogOpen(true)} variant="outline" title="Importar actrices en lote">
          <Plus className="h-4 w-4 mr-1" />
          Importar
        </Button>
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
                {/* Botones de acción */}
                <Button
                  size="icon"
                  className="absolute top-2 left-2 h-7 w-7 z-10 bg-cyan-600 hover:bg-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditLinks(actress);
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
                    handleDelete(actress.id);
                  }}
                  disabled={deleteActress.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>

                {/* Imagen - Click para ir al detalle */}
                <div
                  className="absolute inset-0 cursor-pointer transition-all hover:opacity-90"
                  onClick={() => navigate(`/ver/actress-jav/${actress.id}`)}
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

                {/* Información */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 space-y-1 z-10">
                  <div className="flex items-center justify-center gap-2">
                    {/* Nombre - Click para cargar imagen */}
                    <p
                      className="font-medium text-sm text-white text-center truncate cursor-pointer hover:text-blue-300 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadImage(actress);
                      }}
                    >
                      {actress.name}
                    </p>
                    {actress.javCount !== undefined && actress.javCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full shrink-0">
                        {actress.javCount}
                      </span>
                    )}
                  </div>
                  {actress.links && actress.links.length > 0 && (
                    <div className="flex gap-1 justify-center">
                      {actress.links.slice(0, 3).map((link, index) => (
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

      <ActressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingActress={editingActress}
        onSave={handleSave}
      />

      <ActressLinksDialog
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
    </div>
  );
};

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllJav } from './hooks/useGetAllJav.hook';
import { useDeleteJav } from './hooks/useDeleteJav.hook';
import { useAddJav } from './hooks/useAddJav.hook';
import { useUpdateJav } from './hooks/useUpdateJav.hook';
import { useUpdateJavStatus } from './hooks/useUpdateJavStatus.hook';
import { useBulkAddJav } from './hooks/useBulkAddJav.hook';
import { useUploadJavImage } from './hooks/useUploadJavImage.hook';
import { useImportJavExcel } from './hooks/useImportJavExcel.hook';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/common/components/ui/tooltip';
import { Search, Plus, Trash2, Edit, Eye, Check, Download, Info, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { JavDialog } from './components/form';
import { ExtractCodesDialog } from './components/ExtractCodesDialog';
import { ContentStatus } from '@/common/enums/ver.enum';
import type { Jav } from './models/jav.model';
import { javsPorVer } from './services/javs';

export const JavPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [extractCodesOpen, setExtractCodesOpen] = useState(false);
  const [editingJav, setEditingJav] = useState<Jav | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);
  const [hoveredJavId, setHoveredJavId] = useState<number | null>(null);
  const [pendingReplace, setPendingReplace] = useState<{ file: File; refId: number } | null>(null);

  const { data: savedJavs, isLoading, error } = useGetAllJav();
  const deleteJav = useDeleteJav();
  const addJav = useAddJav();
  const updateJav = useUpdateJav();
  const updateJavStatus = useUpdateJavStatus();
  const bulkAddJav = useBulkAddJav();
  const uploadJavImage = useUploadJavImage();
  const importJavExcel = useImportJavExcel();
  const importInputRef = useRef<HTMLInputElement>(null);

  const uploadPastedImage = useCallback(async (file: File, refId: number) => {
    try {
      await uploadJavImage.mutateAsync({ file, refId });
      toast.success('Imagen actualizada correctamente');
    } catch {
      toast.error('Error al subir la imagen');
    }
  }, [uploadJavImage]);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (!hoveredJavId) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;
        setPendingReplace({ file: blob, refId: hoveredJavId });
        break;
      }
    }
  }, [hoveredJavId]);

  useEffect(() => {
    const listener = (e: Event) => void handlePaste(e as ClipboardEvent);
    document.addEventListener('paste', listener);
    return () => document.removeEventListener('paste', listener);
  }, [handlePaste]);

  const handlePullLocalData = async () => {
    try {
      const results = await bulkAddJav.mutateAsync(javsPorVer);
      const { created, skipped, failed } = results;
      if (failed === 0) {
        toast.success(`${created} JAVs importados${skipped > 0 ? `, ${skipped} ya existían` : ''}`);
      } else {
        toast.warning(`${created} importados, ${skipped} ya existían, ${failed} fallaron`);
      }
    } catch (error) {
      toast.error('Error al importar los JAVs');
    }
  };

  const handleSave = async (jav: Jav) => {
    try {
      if (editingJav) {
        // Actualizar JAV existente
        const linksUrls = jav.links.map((link) => link.url);
        const actressIds = (jav as any).actressIds || [];
        const tagIds = (jav as any).tagIds || [];
        
        await updateJav.mutateAsync({
          id: jav.id,
          data: {
            code: jav.code,
            actressIds: actressIds,
            tagIds: tagIds,
            image: jav.image,
            links: linksUrls,
          },
        });
        toast.success('JAV actualizado correctamente');
      } else {
        // Crear nuevo JAV
        const linksUrls = jav.links.map((link) => link.url);
        const actressIds = (jav as any).actressIds || [];
        const tagIds = (jav as any).tagIds || [];
        
        await addJav.mutateAsync({
          code: jav.code,
          actressIds: actressIds,
          tagIds: tagIds,
          image: jav.image,
          links: linksUrls,
        });
        toast.success('JAV agregado correctamente');
      }
      setDialogOpen(false);
      setEditingJav(null);
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error(editingJav ? 'Error al actualizar el JAV' : 'Error al agregar el JAV');
    }
  };

  const handleToggleStatus = async (jav: Jav) => {
    try {
      const newStatus = jav.status === ContentStatus.Pending
        ? ContentStatus.Completed
        : ContentStatus.Pending;
      
      await updateJavStatus.mutateAsync({ id: jav.id, status: newStatus });
      
      toast.success(
        newStatus === ContentStatus.Completed 
          ? 'JAV marcado como completado' 
          : 'JAV marcado como por ver'
      );
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado del JAV');
    }
  };

  const handleEdit = (jav: Jav) => {
    setEditingJav(jav);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteJav.mutateAsync(id);
      toast.success('JAV eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar el JAV');
    }
  };

  const handleOpenDialog = () => {
    setEditingJav(null);
    setDialogOpen(true);
  };

  const toggleTagFilter = (tagName: string) => {
    setSelectedTagFilters(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  // Obtener todos los tags únicos de los JAVs actuales
  const availableTags = useMemo(() => {
    if (!savedJavs) return [];
    const tagSet = new Set<string>();
    savedJavs.forEach(jav => {
      jav.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [savedJavs]);

  // Filtrar por búsqueda, estado y tags
  const filteredJavs = useMemo(() => {
    if (!savedJavs) return [];

    return savedJavs.filter((jav) => {
      // Filtro de búsqueda
      const matchesSearch =
        jav.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (jav.actresses && jav.actresses.some(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (jav.tags && jav.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      // Filtro de estado
      const matchesStatus = showCompleted
        ? jav.status !== ContentStatus.Pending
        : jav.status === ContentStatus.Pending;

      // Filtro de tags
      const matchesTags = selectedTagFilters.length === 0 ||
        selectedTagFilters.every(filterTag => jav.tags?.includes(filterTag));

      return matchesSearch && matchesStatus && matchesTags;
    });
  }, [savedJavs, searchQuery, showCompleted, selectedTagFilters]);

  return (
    <div className="h-full flex flex-col">
      {/* Barra de herramientas */}
      <div className="flex gap-2 mb-1 flex-wrap px-1 pt-1">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por código, actriz o tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          onClick={() => {
            setShowCompleted(!showCompleted);
          }}
          size="icon"
          className="bg-cyan-500 hover:bg-cyan-600"
        >
          {showCompleted ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button onClick={handleOpenDialog} size="icon" className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" />
        </Button>
        {/* <Button 
          onClick={() => setExtractCodesOpen(true)} 
          size="icon" 
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Code className="h-4 w-4" />
        </Button> */}
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <div className="space-y-2 text-sm">
                <p className="font-semibold">Leyenda de Enlaces:</p>
                <div className="space-y-1">
                  <p><span className="text-red-500 font-bold">[Rojo]</span> Sin censura</p>
                  <p><span className="text-green-500 font-bold">[Verde]</span> Subtítulos en español</p>
                  <p><span className="text-blue-500 font-bold">[Azul]</span> Enlace normal</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* Botón para bulk import */}
        <Button
          onClick={handlePullLocalData}
          disabled={bulkAddJav.isPending}
          size="icon"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Download className="h-4 w-4" />
        </Button>
        {/* Botón para importar Excel */}
        <Button
          onClick={() => importInputRef.current?.click()}
          disabled={importJavExcel.isPending}
          size="icon"
          className="bg-orange-600 hover:bg-orange-700"
          title="Importar en lote desde Excel"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <input
          ref={importInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            await importJavExcel.mutateAsync(file);
            e.target.value = '';
          }}
        />
      </div>

      {/* Filtros de tags */}
      {availableTags.length > 0 && (
        <div className="px-1 mb-1">
          <div className="bg-muted/30 rounded-md p-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-xs font-medium whitespace-nowrap">Filtrar por tags:</p>
              {availableTags.map((tag) => (
                <div
                  key={tag}
                  onClick={() => toggleTagFilter(tag)}
                  className={`h-6 px-2 rounded-full text-xs cursor-pointer inline-flex items-center transition-colors ${
                    selectedTagFilters.includes(tag)
                      ? 'bg-purple-500 text-white'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {tag}
                </div>
              ))}
              {selectedTagFilters.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedTagFilters([])}
                  className="h-6 px-2 text-xs"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista de JAVs */}
      <div className="flex-1 overflow-y-auto px-1 pb-1">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Error al cargar los JAVs</p>
          </div>
        ) : filteredJavs && filteredJavs.length > 0 ? (
          <div className="grid grid-cols-4 gap-x-0 gap-y-1">
            {filteredJavs.map((jav) => (
              <div key={jav.id}
                onMouseEnter={() => setHoveredJavId(jav.id)}
                onMouseLeave={() => setHoveredJavId(null)}
              >
                {/* <div className="relative w-full overflow-hidden bg-muted group aspect-[4/3]"> */}
                <div className="relative w-full overflow-hidden bg-muted group aspect-3/2">
                  <img src={jav.image} alt={jav.code} className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <Button
                      size="icon"
                      className="h-6 w-6 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleEdit(jav)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-6 w-6 bg-green-600 hover:bg-green-700"
                      onClick={() => handleToggleStatus(jav)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-6 w-6 bg-red-600 hover:bg-red-700"
                      onClick={() => handleDelete(jav.id)}
                      disabled={deleteJav.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="mt-1 text-center px-0.5">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <p className="font-bold text-sm">{jav.code}</p>
                    {jav.links && jav.links.length > 0 && (
                      <span className="flex gap-1.5">
                        {jav.links.map((link, index) => {
                          const urlLower = link.url.toLowerCase();
                          const isSinCensura = urlLower.includes("decensored") || urlLower.includes("uncensored");
                          const isSpanish = urlLower.includes("español") || urlLower.includes("spanish");
                          
                          let colorClass = "text-blue-500 hover:text-blue-600";
                          if (isSinCensura) {
                            colorClass = "text-red-500 hover:text-red-600";
                          } else if (isSpanish) {
                            colorClass = "text-green-500 hover:text-green-600";
                          }
                          
                          return (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm underline font-medium ${colorClass}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              [{index + 1}]
                            </a>
                          );
                        })}
                      </span>
                    )}
                  </div>
                  {jav.tags && jav.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mt-1">
                      {jav.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {jav.tags.length > 3 && (
                        <span className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs px-1.5 py-0.5 rounded">
                          +{jav.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  {jav.actresses && jav.actresses.length > 0 && (
                    <div className="text-sm text-muted-foreground truncate mt-0.5">
                      <span className="cursor-pointer hover:underline" onClick={(e) => {
                        e.stopPropagation();
                        if (jav.actresses && jav.actresses.length > 0) {
                          navigate(`/ver/actress-jav/${jav.actresses[0].id}`);
                        }
                      }}>
                        {jav.actresses.map(a => a.name).join(', ')}
                      </span>
                    </div>
                  )}
                  {jav.actress && (
                    <div className="text-sm text-muted-foreground truncate mt-0.5">
                      <span className="cursor-pointer hover:underline" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/ver/actress-jav/${jav.actress!.id}`);
                      }}>
                        {jav.actress.name}
                      </span>
                      {jav.actress.links && jav.actress.links.length > 0 && (
                        <span className="ml-2">
                          {jav.actress.links.map((link, index) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-500 hover:text-blue-600 underline ml-1 font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              [{index + 1}]
                            </a>
                          ))}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {searchQuery || selectedTagFilters.length > 0
              ? 'No se encontraron JAVs con los filtros aplicados'
              : `No hay JAVs ${showCompleted ? 'completados' : 'por ver'}`}
          </p>
        )}
      </div>

      <JavDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingJav={editingJav}
        onSave={handleSave}
      />

      <ExtractCodesDialog
        open={extractCodesOpen}
        onOpenChange={setExtractCodesOpen}
      />

      <Dialog open={!!pendingReplace} onOpenChange={(open) => !open && setPendingReplace(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reemplazar imagen</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Este JAV ya tiene imagen. ¿Deseas reemplazarla?</p>
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
    </div>
  );
};

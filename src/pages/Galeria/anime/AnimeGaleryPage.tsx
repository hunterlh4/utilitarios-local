import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import { Spinner } from '@/common/components/ui/spinner';
import { Textarea } from '@/common/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu';
import { downloadBase64File } from '@/common/lib/download-file';
import { Plus, Upload, Trash2, Pencil, ChevronDown, Download } from 'lucide-react';
import { useGetAllAnimeGalery } from './hooks/useGetAllAnimeGalery.hook';
import { useCreateAnimeGalery } from './hooks/useCreateAnimeGalery.hook';
import { useUpdateAnimeGalery } from './hooks/useUpdateAnimeGalery.hook';
import { useDeleteAnimeGalery } from './hooks/useDeleteAnimeGalery.hook';
import { useUploadImage } from './hooks/useUploadImage.hook';
import { useGetMediaByRefId } from './hooks/useGetMediaByRefId.hook';
import { CreateGaleryDialog } from './components/CreateGaleryDialog';
import { EditGaleryDialog } from './components/EditGaleryDialog';
import { animeGaleryService } from './services/anime-galery.service';

export const AnimeGaleryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const selectedGalery = id ? Number(id) : null;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingGaleryId, setEditingGaleryId] = useState<number | null>(null);
  const [hoveredGaleryId, setHoveredGaleryId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [linksText, setLinksText] = useState('');
  const [isSavingLinks, setIsSavingLinks] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: galeries, isLoading, refetch } = useGetAllAnimeGalery();
  const createGalery = useCreateAnimeGalery();
  const updateGalery = useUpdateAnimeGalery();
  const deleteGalery = useDeleteAnimeGalery();
  const uploadCoverImage = useUploadImage();
  const { data: media, isLoading: isLoadingMedia } = useGetMediaByRefId(selectedGalery);

  const { data: editingGaleryDetail, isLoading: isLoadingEdit } = useQuery({
    queryKey: ['animeGaleryDetail', editingGaleryId],
    queryFn: () => animeGaleryService.getById(editingGaleryId!),
    enabled: !!editingGaleryId,
  });

  const { data: selectedGaleryDetail, refetch: refetchSelectedDetail } = useQuery({
    queryKey: ['animeGaleryDetailSelected', selectedGalery],
    queryFn: () => animeGaleryService.getById(selectedGalery!),
    enabled: !!selectedGalery,
  });

  const handleCreateGalery = async (name: string, image: File | null) => {
    try {
      const result = await createGalery.mutateAsync(name);

      if (image && result.id) {
        await animeGaleryService.uploadImage(image, result.id);
        toast.success('Galeria creada e imagen subida correctamente');
      } else {
        toast.success('Galeria creada correctamente');
      }

      setDialogOpen(false);
      await refetch();
    } catch (error) {
      console.error('Error al crear galeria:', error);
      toast.error('Error al crear la galeria');
    }
  };

  const handleDeleteGalery = async (idToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteGalery.mutateAsync(idToDelete);
      toast.success('Galeria eliminada correctamente');
      if (selectedGalery === idToDelete) {
        navigate('/galeria/anime');
      }
    } catch (error) {
      console.error('Error al eliminar galeria:', error);
      toast.error('Error al eliminar la galeria');
    }
  };

  const handleEditGalery = (idToEdit: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGaleryId(idToEdit);
    setEditDialogOpen(true);
  };

  const handleUpdateGalery = async (name: string) => {
    if (!editingGaleryId) return;
    try {
      await updateGalery.mutateAsync({
        id: editingGaleryId,
        payload: { name },
      });
      toast.success('Galeria actualizada correctamente');
      setEditDialogOpen(false);
      setEditingGaleryId(null);
      await refetch();
    } catch (error) {
      console.error('Error al actualizar galeria:', error);
      toast.error('Error al actualizar la galeria');
    }
  };

  const handleUploadClick = () => {
    if (!selectedGalery) {
      toast.error('Selecciona una galeria primero');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedGalery) return;

    for (const file of Array.from(files)) {
      try {
        await animeGaleryService.uploadMedia(file, selectedGalery);
      } catch (error) {
        console.error('Error al subir imagen:', error);
        toast.error(`Error al subir ${file.name}`);
      }
    }

    toast.success('Imagenes subidas correctamente');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    await refetch();
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const file = await animeGaleryService.exportExcel();
      downloadBase64File(file.base64, file.fileName || 'anime-galery.xlsx');
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
      const result = await animeGaleryService.importExcel(file);
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

  const handleSaveLinks = async () => {
    if (!selectedGalery) {
      return;
    }

    const links = linksText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    setIsSavingLinks(true);
    try {
      await animeGaleryService.updateLinks(selectedGalery, links);
      toast.success('Links actualizados correctamente');
      await refetchSelectedDetail();
    } catch {
      toast.error('No se pudieron actualizar los links');
    } finally {
      setIsSavingLinks(false);
    }
  };

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;

        try {
          if (selectedGalery) {
            await animeGaleryService.uploadMedia(blob, selectedGalery);
            toast.success('Imagen subida correctamente a la galeria');
          } else if (hoveredGaleryId) {
            await uploadCoverImage.mutateAsync({ file: blob, refId: hoveredGaleryId });
            toast.success('Imagen de portada subida correctamente');
          } else {
            return;
          }

          await refetch();
        } catch (error) {
          console.error('Error:', error);
          toast.error('Error al subir la imagen');
        }
        return;
      }
    }
  }, [hoveredGaleryId, refetch, selectedGalery, uploadCoverImage]);

  useEffect(() => {
    const pasteListener = (event: Event) => {
      void handlePaste(event as ClipboardEvent);
    };

    document.addEventListener('paste', pasteListener);
    return () => {
      document.removeEventListener('paste', pasteListener);
    };
  }, [handlePaste]);

  useEffect(() => {
    const text = selectedGaleryDetail?.links?.map((item) => item.url).join('\n') ?? '';
    setLinksText(text);
  }, [selectedGaleryDetail]);

  const selectedGaleryData = galeries?.find((g) => g.id === selectedGalery);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1
          className={`text-3xl font-bold ${selectedGalery ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
          onClick={() => selectedGalery && navigate('/galeria/anime')}
        >
          {selectedGaleryData?.name || 'Galeria Anime'}
        </h1>
        <div className="flex gap-2">
          {selectedGalery ? (
            <>
              <Button
                onClick={handleUploadClick}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir imagenes
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLinks((prev) => !prev)}
              >
                {showLinks ? 'Ocultar links' : 'Mostrar links'}
              </Button>
              <Button
                onClick={handleSaveLinks}
                disabled={isSavingLinks}
              >
                {isSavingLinks ? <Spinner className="h-4 w-4" /> : 'Subir links'}
              </Button>
            </>
          ) : (
            <div className="flex items-center overflow-hidden rounded-md">
              <Button onClick={() => setDialogOpen(true)} className="rounded-none border-0">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Galeria
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    disabled={isExporting || isImporting}
                    className="rounded-none border-0 border-l border-primary-foreground/25 px-2"
                    aria-label="Abrir acciones de Excel"
                  >
                    {isExporting || isImporting ? <Spinner className="h-4 w-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-1.5 bg-primary">
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
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <input
        ref={importInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleImportExcel}
      />

      {!selectedGalery && (
        <div>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : galeries && galeries.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
              {galeries.map((galery) => (
                <div
                  key={galery.id}
                  className="relative w-full transition-all hover:opacity-90 group"
                  style={{ paddingBottom: '150%' }}
                  onClick={() => navigate(`/galeria/anime/${galery.id}`)}
                  onMouseEnter={() => setHoveredGaleryId(galery.id)}
                  onMouseLeave={() => setHoveredGaleryId(null)}
                >
                  <Button
                    size="icon"
                    variant="destructive"
                    className="cursor-pointer absolute top-2 right-2 h-7 w-7 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteGalery(galery.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="cursor-pointer absolute top-2 left-2 h-7 w-7 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleEditGalery(galery.id, e)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  {galery.image ? (
                    <img
                      src={galery.image}
                      alt={galery.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted">
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No hay galerias creadas</p>
          )}
        </div>
      )}

      {selectedGalery && (
        <div>
          {showLinks && (
            <div className="mb-4 space-y-2">
              <p className="text-sm text-muted-foreground">Pega un link por linea</p>
              <Textarea
                value={linksText}
                onChange={(e) => setLinksText(e.target.value)}
                placeholder="https://ejemplo.com/link-1"
                rows={6}
              />
            </div>
          )}

          {isLoadingMedia ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : media && media.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
              {media.map((img) => (
                <div key={img.id} className="relative w-full" style={{ paddingBottom: '150%' }}>
                  <img
                    src={img.url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No hay imagenes en esta galeria</p>
          )}
        </div>
      )}

      <CreateGaleryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleCreateGalery}
      />

      <EditGaleryDialog
        key={`${editingGaleryId ?? 'none'}-${editDialogOpen ? 'open' : 'closed'}`}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingGaleryId(null);
        }}
        galery={editingGaleryDetail || null}
        isLoading={isLoadingEdit || updateGalery.isPending}
        onSave={handleUpdateGalery}
      />
    </div>
  );
};

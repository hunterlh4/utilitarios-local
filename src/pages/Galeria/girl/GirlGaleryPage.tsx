import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import { Spinner } from '@/common/components/ui/spinner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu';
import { downloadBase64File } from '@/common/lib/download-file';
import { Plus, Upload, Trash2, Pencil, ChevronDown, Download } from 'lucide-react';
import { useGetAllGirlGalery } from './hooks/useGetAllGirlGalery.hook';
import { useCreateGirlGalery } from './hooks/useCreateGirlGalery.hook';
import { useUpdateGirlGalery } from './hooks/useUpdateGirlGalery.hook';
import { useDeleteGirlGalery } from './hooks/useDeleteGirlGalery.hook';
import { useUploadImage } from './hooks/useUploadImage.hook';
import { CreateGaleryDialog } from './components/CreateGaleryDialog';
import { EditGaleryDialog } from './components/EditGaleryDialog';
import { girlGaleryService } from './services/girl.service';

export const GirlGaleryPage = () => {
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingGaleryId, setEditingGaleryId] = useState<number | null>(null);
  const [hoveredGaleryId, setHoveredGaleryId] = useState<number | null>(null);
  const [pendingReplace, setPendingReplace] = useState<{ file: File; refId: number } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: galeries, isLoading, refetch } = useGetAllGirlGalery();
  const createGalery = useCreateGirlGalery();
  const updateGalery = useUpdateGirlGalery();
  const deleteGalery = useDeleteGirlGalery();
  const uploadCoverImage = useUploadImage();

  const { data: editingGaleryDetail, isLoading: isLoadingEdit } = useQuery({
    queryKey: ['girlGaleryDetail', editingGaleryId],
    queryFn: () => girlGaleryService.getById(editingGaleryId!),
    enabled: !!editingGaleryId,
  });

  const handleCreateGalery = async (name: string) => {
    try {
      await createGalery.mutateAsync(name);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error al crear galeria:', error);
    }
  };

  const handleDeleteGalery = async (idToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteGalery.mutateAsync(idToDelete);
    } catch (error) {
      console.error('Error al eliminar galeria:', error);
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
      setEditDialogOpen(false);
      setEditingGaleryId(null);
    } catch (error) {
      console.error('Error al actualizar galeria:', error);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const file = await girlGaleryService.exportExcel();
      downloadBase64File(file.base64, file.fileName || 'girl-galery.xlsx');
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
      const result = await girlGaleryService.importExcel(file);
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

  const uploadPastedCover = useCallback(async (file: File, refId: number) => {
    try {
      await uploadCoverImage.mutateAsync({ file, refId });
      toast.success('Imagen de portada subida correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al subir la imagen');
    }
  }, [uploadCoverImage]);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (!hoveredGaleryId) return;

    const hoveredGalery = galeries?.find((galery) => galery.id === hoveredGaleryId);
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;

        if (hoveredGalery?.image) {
          setPendingReplace({ file: blob, refId: hoveredGaleryId });
          return;
        }

        await uploadPastedCover(blob, hoveredGaleryId);
        break;
      }
    }
  }, [galeries, hoveredGaleryId, uploadPastedCover]);

  useEffect(() => {
    const pasteListener = (event: Event) => {
      void handlePaste(event as ClipboardEvent);
    };

    document.addEventListener('paste', pasteListener);
    return () => {
      document.removeEventListener('paste', pasteListener);
    };
  }, [handlePaste]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Galeria Chicas</h1>
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
      </div>

      <input
        ref={importInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleImportExcel}
      />

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
              onClick={() => navigate(`/galeria/girl/${galery.id}`)}
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
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">No hay galerias creadas</p>
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

      <Dialog open={!!pendingReplace} onOpenChange={(open) => !open && setPendingReplace(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reemplazar imagen</DialogTitle>
          </DialogHeader>
          <p>Esta galería ya tiene imagen. ¿Deseas reemplazarla?</p>
          <DialogFooter>
            <Button variant="outline" className="focus-visible:ring-0 focus-visible:ring-offset-0" onClick={() => setPendingReplace(null)}>
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (!pendingReplace) return;
                await uploadPastedCover(pendingReplace.file, pendingReplace.refId);
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

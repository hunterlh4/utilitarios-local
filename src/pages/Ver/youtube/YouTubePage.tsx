import { useRef, useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Upload, Download, Plus, Trash2, ExternalLink } from 'lucide-react';
import { downloadBase64File } from '@/common/lib/download-file';
import { useGetAllYouTube } from './hooks/useGetAllYouTube.hook';
import { useExportYouTube } from './hooks/useExportYouTube.hook';
import { useImportYouTube } from './hooks/useImportYouTube.hook';
import { useAddYouTube } from './hooks/useAddYouTube.hook';
import { useDeleteYouTube } from './hooks/useDeleteYouTube.hook';
import { YouTubeFormDialog } from './components/YouTubeFormDialog';
import type { YouTube } from './models/youtube.model';
import type { CreateYouTubeDto, UpdateYouTubeDto } from './models/youtube-request.dto';

const CATEGORY_LABELS: Record<YouTube['category'], string> = {
  '1': 'Anime',
  '2': 'Serie',
  '3': 'Película',
  '4': 'Shorts',
};

export const YouTubePage = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<YouTube | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: videos, refetch } = useGetAllYouTube();
  const exportYouTube = useExportYouTube();
  const importYouTube = useImportYouTube();
  const addYouTube = useAddYouTube();
  const deleteYouTube = useDeleteYouTube();

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const file = await exportYouTube.mutateAsync();
      downloadBase64File(file.base64, file.fileName || 'youtube.xlsx');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleAddClick = () => {
    setFormOpen(true);
  };

  const handleSave = async (data: CreateYouTubeDto | UpdateYouTubeDto) => {
    await addYouTube.mutateAsync(data as CreateYouTubeDto);
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    await deleteYouTube.mutateAsync(pendingDelete.id);
    setPendingDelete(null);
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importYouTube.mutateAsync(file);
      await refetch();
    } finally {
      event.target.value = '';
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <input
          ref={importInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleImportExcel}
        />
        <div className="flex items-center gap-2 flex-wrap">
          <Button type="button" onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
          <Button type="button" variant="outline" onClick={handleImportClick} disabled={isExporting || isImporting}>
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button type="button" variant="outline" onClick={handleExportExcel} disabled={isExporting || isImporting}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Registros actuales: {videos?.length ?? 0}</p>

      {videos?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {videos.map((video) => (
            <div key={video.id} className="rounded-xl border bg-background p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-3">
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title} className="w-28 h-20 object-cover rounded-md shrink-0" />
                ) : (
                  <div className="w-28 h-20 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0">
                    Sin miniatura
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{video.title}</h3>
                      <p className="text-xs text-muted-foreground truncate">{video.url}</p>
                    </div>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                      {CATEGORY_LABELS[video.category]}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setPendingDelete(video)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No hay videos cargados.
        </div>
      )}

      <YouTubeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSave}
      />

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar video</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            ¿Seguro que deseas eliminar <span className="font-medium text-foreground">{pendingDelete?.title}</span>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

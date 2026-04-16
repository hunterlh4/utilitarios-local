import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import { Spinner } from '@/common/components/ui/spinner';
import { Textarea } from '@/common/components/ui/textarea';
import { ExternalLink, Link2, Upload } from 'lucide-react';
import { useGetMediaByRefId } from './hooks/useGetMediaByRefId.hook';
import { animeGaleryService } from './services/anime-galery.service';
import { useLoading } from '@/common/context/loading/LoadingContext';

export const AnimeGaleryDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const selectedGalery = id ? Number(id) : null;

  const [linksText, setLinksText] = useState('');
  const [isSavingLinks, setIsSavingLinks] = useState(false);
  const [showLinks, setShowLinks] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const loading = useLoading();

  const { data: selectedGaleryDetail, isLoading, refetch } = useQuery({
    queryKey: ['animeGaleryDetailSelected', selectedGalery],
    queryFn: () => animeGaleryService.getById(selectedGalery!),
    enabled: !!selectedGalery,
  });

  const { data: media, isLoading: isLoadingMedia, refetch: refetchMedia } = useGetMediaByRefId(selectedGalery);

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
        loading.show('Subiendo imagen...');
        await animeGaleryService.uploadMedia(file, selectedGalery);
      } catch (error) {
        console.error('Error al subir imagen:', error);
        toast.error(`Error al subir ${file.name}`);
      } finally {
        loading.hide();
      }
    }

    toast.success('Imagenes subidas correctamente');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    await refetchMedia();
    await refetch();
  };

  const handleSaveLinks = async () => {
    if (!selectedGalery) {
      return;
    }

    const existingLinks = selectedGaleryDetail?.links?.map((item) => item.url.trim()).filter(Boolean) ?? [];
    const newLinks = linksText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const links = Array.from(new Set([...existingLinks, ...newLinks]));

    setIsSavingLinks(true);
    try {
      await animeGaleryService.updateLinks(selectedGalery, links);
      toast.success('Links actualizados correctamente');
      await refetch();
    } catch {
      toast.error('No se pudieron actualizar los links');
    } finally {
      setIsSavingLinks(false);
    }
  };

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items || !selectedGalery) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;

        try {
          loading.show('Subiendo imagen...');
          await animeGaleryService.uploadMedia(blob, selectedGalery);
          toast.success('Imagen subida correctamente a la galeria');
          await refetchMedia();
          await refetch();
        } catch (error) {
          console.error('Error:', error);
          toast.error('Error al subir la imagen');
        } finally {
          loading.hide();
        }
        return;
      }
    }
  }, [loading, refetch, refetchMedia, selectedGalery]);

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
    setLinksText('');
  }, [selectedGalery]);

  if (!selectedGalery) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!selectedGaleryDetail) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No se encontro la galeria</p>
        <Button onClick={() => navigate('/galeria/anime')} variant="outline">
          Volver a galerias
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
        
          <h1
            className="text-3xl font-bold truncate cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate('/galeria/anime')}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navigate('/galeria/anime');
              }
            }}
          >
            {selectedGaleryDetail.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUploadClick} className="bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4 mr-2" />
            Subir imagenes
          </Button>
          <Button variant="outline" onClick={() => setShowLinks((prev) => !prev)} className="w-10 px-0" aria-label={showLinks ? 'Ocultar links' : 'Mostrar links'}>
            <Link2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />

      <div className={`grid gap-0 ${showLinks ? 'xl:grid-cols-6' : ''}`}>
        <div className={`min-w-0 ${showLinks ? 'xl:col-span-5' : ''}`}>
          {isLoadingMedia ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : media && media.length > 0 ? (
            <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 ${showLinks ? 'xl:grid-cols-5' : 'xl:grid-cols-6'} gap-0`}>
              {media.map((img) => (
                <div key={img.id} className="relative w-full" style={{ paddingBottom: '150%' }}>
                  <img src={img.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No hay imagenes en esta galeria</p>
          )}
        </div>

        {showLinks && (
          <aside className="w-full rounded-lg border bg-background p-2 shadow-sm xl:col-span-1 xl:border-l-0 xl:rounded-l-none">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-sm font-semibold">Links</h2>
              <Button onClick={handleSaveLinks} disabled={isSavingLinks} size="sm">
                {isSavingLinks ? <Spinner className="h-4 w-4" /> : 'Subir links'}
              </Button>
            </div>

            <div className="space-y-3">
              <Textarea value={linksText} onChange={(e) => setLinksText(e.target.value)} rows={2} />

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 ">
                {(selectedGaleryDetail.links?.length ?? 0) > 0 ? (
                  selectedGaleryDetail.links.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.name?.trim() || item.url}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No hay links cargados</p>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

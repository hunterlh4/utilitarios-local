import { useState } from 'react';
import { useGetAllJav } from './hooks/useGetAllJav.hook';
import { useDeleteJav } from './hooks/useDeleteJav.hook';
import { useAddJav } from './hooks/useAddJav.hook';
import { useUpdateJav } from './hooks/useUpdateJav.hook';
import { useUpdateJavStatus } from './hooks/useUpdateJavStatus.hook';
import { useBulkAddJav } from './hooks/useBulkAddJav.hook';
import { ContentStatus } from '@/common/enums/ver.enum';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/common/components/ui/tooltip';
import { Search, Plus, Trash2, Edit, Eye, Check, Download, Info, Code } from 'lucide-react';
import { toast } from 'sonner';
import { JavDialog } from './components/form';
import { ExtractCodesDialog } from './components/ExtractCodesDialog';
import type { Jav } from './models/jav.model';
import { javsPorVer } from './services/javs';

export const JavPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [extractCodesOpen, setExtractCodesOpen] = useState(false);
  const [editingJav, setEditingJav] = useState<Jav | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const { data: savedJavs, isLoading, error } = useGetAllJav();
  const deleteJav = useDeleteJav();
  const addJav = useAddJav();
  const updateJav = useUpdateJav();
  const updateJavStatus = useUpdateJavStatus();
  const bulkAddJav = useBulkAddJav();

  const handlePullLocalData = async () => {
    try {
      // Convertir los JAVs locales al formato del backend
      const javsToAdd = javsPorVer.map((jav) => ({
        code: jav.nombre,
        actressName: jav.actriz,
        actressUrl: jav.actrizUrl,
        image: jav.imagen,
        links: jav.enlaces,
      }));

      const results = await bulkAddJav.mutateAsync(javsToAdd);
      
      // Contar éxitos y fallos
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;
      
      if (failed === 0) {
        toast.success(`${successful} JAVs agregados correctamente`);
      } else {
        toast.warning(`${successful} JAVs agregados, ${failed} fallaron`);
      }
    } catch (error) {
      console.error('Error al importar JAVs:', error);
      toast.error('Error al importar los JAVs locales');
    }
  };

  const handleSave = async (jav: Jav) => {
    try {
      if (editingJav) {
        // Actualizar JAV existente (sin enviar status)
        // Convertir LinkDto[] a string[] para el backend
        const linksUrls = jav.links.map((link) => link.url);
        
        await updateJav.mutateAsync({
          id: jav.id,
          data: {
            code: jav.code,
            actressName: jav.actressName,
            image: jav.image,
            links: linksUrls,
          },
        });
        toast.success('JAV actualizado correctamente');
      } else {
        // Crear nuevo JAV (sin enviar status, el backend lo asigna por defecto)
        // Convertir LinkDto[] a string[] para el backend
        const linksUrls = jav.links.map((link) => link.url);
        
        await addJav.mutateAsync({
          code: jav.code,
          actressName: jav.actressName,
          actressUrl: jav.actressUrl,
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
      const newStatus = jav.status === ContentStatus.Proximamente 
        ? ContentStatus.Completado 
        : ContentStatus.Proximamente;
      
      await updateJavStatus.mutateAsync({ id: jav.id, status: newStatus });
      
      toast.success(
        newStatus === ContentStatus.Completado 
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

  // Filtrar por búsqueda y estado
  const filteredJavs = savedJavs?.filter((jav) => {
    const matchesSearch =
      jav.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (jav.actress?.name && jav.actress.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Ajustar para status 0 (por ver) y otros valores (completado)
    const matchesStatus = showCompleted
      ? jav.status !== 0 && jav.status !== ContentStatus.Proximamente
      : jav.status === 0 || jav.status === ContentStatus.Proximamente;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Barra de herramientas */}
      <div className="flex gap-2 mb-1 flex-wrap px-1 pt-1">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por código o actriz..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          onClick={() => setShowCompleted(!showCompleted)}
          size="icon"
          className="bg-cyan-500 hover:bg-cyan-600"
        >
          {showCompleted ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button onClick={handleOpenDialog} size="icon" className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" />
        </Button>
        <Button 
          onClick={() => setExtractCodesOpen(true)} 
          size="icon" 
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Code className="h-4 w-4" />
        </Button>
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
        {/* Botón oculto para bulk import */}
        {false && (
          <Button
            onClick={handlePullLocalData}
            disabled={bulkAddJav.isPending}
            size="icon"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>

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
              <div key={jav.id}>
                {/* <div className="relative w-full overflow-hidden bg-muted group aspect-[4/3]"> */}
                <div className="relative w-full overflow-hidden bg-muted group aspect-[3/2]">
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
                  {jav.actress && (
                    <div className="text-sm text-muted-foreground truncate mt-0.5">
                      <span>{jav.actress.name}</span>
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
            No hay JAVs {showCompleted ? 'completados' : 'por ver'}
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
    </div>
  );
};

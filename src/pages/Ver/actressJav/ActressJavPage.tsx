import { useState, useMemo } from 'react';
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
import { Search, Plus, Trash2, Edit, Link as LinkIcon, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ActressDialog } from './components/form';
import { ActressLinksDialog } from './components/ActressLinksDialog';
import type { ActressJav } from './models/actress.model';

export const ActressJavPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linksDialogOpen, setLinksDialogOpen] = useState(false);
  const [editingActress, setEditingActress] = useState<ActressJav | null>(null);
  const [selectedTagFilters, setSelectedTagFilters] = useState<string[]>([]);

  const { data: actresses, isLoading, error } = useGetAllActresses();
  const deleteActress = useDeleteActress();
  const addActress = useAddActress();
  const updateActress = useUpdateActress();
  const updateActressLinks = useUpdateActressLinks();
  const uploadImage = useUploadImage();

  const handleSave = async (actress: ActressJav) => {
    try {
      if (editingActress) {
        const tagIds = (actress as any).tagIds || [];
        await updateActress.mutateAsync({
          id: actress.id,
          data: {
            name: actress.name,
            tagIds: tagIds,
          },
        });
        toast.success('Actriz actualizada correctamente');
      } else {
        const tagIds = (actress as any).tagIds || [];
        await addActress.mutateAsync({
          name: actress.name,
          tagIds: tagIds,
        });
        toast.success('Actriz agregada correctamente');
      }
      setDialogOpen(false);
      setEditingActress(null);
    } catch (error: any) {
      console.error('Error al guardar:', error);
      
      // Mostrar mensaje específico si viene del backend
      const errorMessage = error?.response?.data?.message || error?.message;
      
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
        <div className="relative flex-1 min-w-[200px]">
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
          <div className="grid grid-cols-1 gap-2">
            {filteredActresses.map((actress) => (
              <div 
                key={actress.id} 
                className="bg-muted/30 rounded-lg p-3 flex items-center gap-3 group hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/ver/actress-jav/${actress.id}`)}
              >
                {/* Imagen */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  {actress.image ? (
                    <img 
                      src={actress.image} 
                      alt={actress.name} 
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    size="icon"
                    className="absolute inset-0 w-full h-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadImage(actress);
                    }}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>

                {/* Información */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base">{actress.name}</p>
                    {actress.javCount !== undefined && actress.javCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {actress.javCount} JAV{actress.javCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {actress.tags && actress.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {actress.tags.map((tag, idx) => (
                        <span key={idx} className="bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {actress.links && actress.links.length > 0 && (
                    <div className="flex gap-2 mt-1">
                      {actress.links.map((link, index) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:text-blue-600 underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          [{index + 1}]
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    className="h-8 w-8 bg-cyan-600 hover:bg-cyan-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditLinks(actress);
                    }}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-8 w-8 bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(actress);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-8 w-8 bg-red-600 hover:bg-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(actress.id);
                    }}
                    disabled={deleteActress.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
    </div>
  );
};

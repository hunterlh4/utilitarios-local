import { useMemo, useState } from 'react';
import { Search, Plus, ChevronDown, Download, Upload, Image as ImageIcon, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/common/components/ui/badge';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import { Dialog, DialogContent } from '@/common/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu';
import { useGetAllProjects } from './hooks/useGetAllProyects.hook';
import { useAddProject } from './hooks/useAddProyect.hook';
import { useUpdateProject } from './hooks/useUpdateProyect.hook';
import { ProjectFormDialog } from './components/ProjectFormDialog';
import { projectService } from './services/project.service';
import type { Project, ProjectDetail } from './models/project.model';
import type { CreateProjectDto, UpdateProjectDto } from './models/project-request.dto';

export const ProjectPage = () => {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const { data: projects, isLoading, error } = useGetAllProjects();
  const addProject = useAddProject();
  const updateProject = useUpdateProject();

  const { data: editingDetail } = useQuery<ProjectDetail>({
    queryKey: ['project-detail', editing?.id],
    queryFn: () => projectService.getById(editing!.id),
    enabled: !!editing && dialogOpen,
  });

  const { data: galleryDetail } = useQuery<ProjectDetail>({
    queryKey: ['project-detail', galleryProject?.id],
    queryFn: () => projectService.getById(galleryProject!.id),
    enabled: !!galleryProject,
  });

  const availableTags = useMemo(() => {
    if (!projects) return [];
    const set = new Set<string>();
    projects.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (projects ?? []).filter((p) => {
      const matchSearch = !q || p.name.toLowerCase().includes(q);
      const matchTags = selectedTags.length === 0 || selectedTags.every((t) => p.tags?.includes(t));
      return matchSearch && matchTags;
    });
  }, [projects, search, selectedTags]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const handleSave = async (data: CreateProjectDto | UpdateProjectDto) => {
    try {
      if (editing) {
        await updateProject.mutateAsync({ id: editing.id, data: data as UpdateProjectDto });
        toast.success('Proyecto actualizado');
      } else {
        await addProject.mutateAsync(data as CreateProjectDto);
        toast.success('Proyecto creado');
      }
      setDialogOpen(false);
      setEditing(null);
    } catch {
      toast.error('Error al guardar');
    }
  };

  const openEdit = (p: Project) => { setEditing(p); setDialogOpen(true); };

  const openGallery = (p: Project) => {
    setGalleryProject(p);
    setGalleryIndex(0);
  };

  const galleryImages = galleryDetail?.media ?? [];
  const prevImage = () => setGalleryIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  const nextImage = () => setGalleryIndex((i) => (i + 1) % galleryImages.length);

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex gap-2 px-1 pt-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar proyecto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex items-center overflow-hidden rounded-md">
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="rounded-none border-0">
            <Plus className="h-4 w-4 mr-1" />Crear
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="rounded-none border-0 border-l border-primary-foreground/25 px-2">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1.5 bg-primary">
              <DropdownMenuItem className="h-9 cursor-pointer rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground">
                <Download className="mr-2 h-4 w-4" /> Exportar
              </DropdownMenuItem>
              <DropdownMenuItem className="mt-1 h-9 cursor-pointer rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground">
                <Upload className="mr-2 h-4 w-4" /> Importar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tag filters */}
      {availableTags.length > 0 && (
        <div className="px-1">
          <div className="bg-muted/30 rounded-md p-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-xs font-medium whitespace-nowrap">Filtrar por tags:</p>
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                  className="cursor-pointer select-none font-thin"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {selectedTags.length > 0 && (
                <Button size="sm" variant="ghost" onClick={() => setSelectedTags([])} className="h-6 px-2 text-xs">Limpiar</Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-1 pb-1">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner className="h-8 w-8" /></div>
        ) : error ? (
          <p className="text-center text-red-500 py-8">Error al cargar los proyectos</p>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="group relative border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow bg-card"
                onClick={() => openEdit(project)}
                onContextMenu={(e) => { e.preventDefault(); openGallery(project); }}
              >
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  {project.firstImageUrl ? (
                    <img src={project.firstImageUrl} alt={project.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-sm font-medium line-clamp-1">{project.name}</p>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} className="shrink-0">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                  </div>
              
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {search || selectedTags.length > 0 ? 'Sin resultados' : 'No hay proyectos'}
          </p>
        )}
      </div>

      {/* Form dialog */}
      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}
        editing={editing}
        detail={editingDetail}
        onSave={handleSave}
        isSaving={addProject.isPending || updateProject.isPending}
      />

      {/* Gallery dialog */}
      <Dialog open={!!galleryProject} onOpenChange={(open) => !open && setGalleryProject(null)}>
        <DialogContent className="max-w-screen w-screen h-screen p-0 overflow-hidden bg-black border-0 rounded-none">
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            {/* Close */}
            <button
              onClick={() => setGalleryProject(null)}
              className="absolute top-2 right-2 z-10 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>

            {galleryImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-white/50 gap-2">
                <ImageIcon className="h-12 w-12" />
                <p className="text-sm">Sin imágenes</p>
              </div>
            ) : (
              <>
                <img
                  src={galleryImages[galleryIndex]?.url}
                  alt=""
                  className="max-h-[calc(100vh-48px)] max-w-full object-contain"
                />
                {galleryImages.length > 1 && (
                  <>
                    <button onClick={prevImage}
                      className="absolute left-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={nextImage}
                      className="absolute right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {galleryImages.map((_, i) => (
                        <button key={i} onClick={() => setGalleryIndex(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${i === galleryIndex ? 'bg-white' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          {galleryProject && (
            <div className="bg-black/80 px-4 py-2 text-white text-sm">
              {galleryProject.name}
              {galleryImages.length > 1 && (
                <span className="text-white/50 ml-2">{galleryIndex + 1} / {galleryImages.length}</span>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

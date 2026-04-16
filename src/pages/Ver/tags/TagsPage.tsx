import { useRef, useState } from 'react';
import { useGetTags } from '@/common/hooks/useGetTags.hook';
import { useCreateTag } from '@/common/hooks/useCreateTag.hook';
import { useUpdateTag } from '@/common/hooks/useUpdateTag.hook';
import { useDeleteTag } from '@/common/hooks/useDeleteTag.hook';
import { useExportTags } from '@/common/hooks/useExportTags.hook';
import { useImportTags } from '@/common/hooks/useImportTags.hook';
import { TagType, TagTypeLabels } from '@/common/enums/tag-type.enum';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Spinner } from '@/common/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { Tag } from '@/common/services/tag.service';
import { downloadBase64File } from '@/common/lib/download-file';

export const TagsPage = () => {
  const [selectedType, setSelectedType] = useState<TagType>(TagType.Jav);
  const [createMode, setCreateMode] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [editTagName, setEditTagName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: tags, isLoading } = useGetTags(selectedType);
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();
  const exportTags = useExportTags();
  const importTags = useImportTags();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const file = await exportTags.mutateAsync();
      downloadBase64File(file.base64, file.fileName || 'tags.xlsx');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importTags.mutateAsync(file);
    } finally {
      event.target.value = '';
      setIsImporting(false);
    }
  };

  const handleCreate = async () => {
    if (!newTagName.trim()) {
      toast.error('El nombre del tag es requerido');
      return;
    }

    try {
      await createTag.mutateAsync({
        name: newTagName.trim(),
        type: selectedType,
      });
      toast.success('Tag creado correctamente');
      setNewTagName('');
      setCreateMode(false);
    } catch (error) {
      console.error('Error al crear tag:', error);
      toast.error('Error al crear el tag');
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editTagName.trim()) {
      toast.error('El nombre del tag es requerido');
      return;
    }

    try {
      await updateTag.mutateAsync({
        id,
        data: { name: editTagName.trim() },
      });
      toast.success('Tag actualizado correctamente');
      setEditingTag(null);
      setEditTagName('');
    } catch (error) {
      console.error('Error al actualizar tag:', error);
      toast.error('Error al actualizar el tag');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el tag "${name}"?`)) return;

    try {
      await deleteTag.mutateAsync(id);
      toast.success('Tag eliminado correctamente');
    } catch (error: unknown) {
      console.error('Error al eliminar tag:', error);
      const maybeApiError = error as {
        response?: { data?: { message?: string } };
      };

      if (maybeApiError.response?.data?.message?.includes('in use')) {
        toast.error('No se puede eliminar el tag porque está en uso');
      } else {
        toast.error('Error al eliminar el tag');
      }
    }
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
    setCreateMode(false);
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditTagName('');
  };

  const handleStartCreate = () => {
    setCreateMode(true);
    setEditingTag(null);
    setNewTagName('');
  };

  const handleCancelCreate = () => {
    setCreateMode(false);
    setNewTagName('');
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Tags</h1>
        <div className="flex gap-2">
          <input
            ref={importInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImport}
          />
          <Button
            variant="outline"
            onClick={handleImportClick}
            disabled={isExporting || isImporting}
          >
            Importar
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting || isImporting}
          >
            Exportar
          </Button>
          <Button
            onClick={handleStartCreate}
            disabled={createMode}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Tag
          </Button>
        </div>
      </div>

      {/* Selector de tipo */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Tipo de Tag:</label>
        <Select
          value={selectedType.toString()}
          onValueChange={(value) => {
            setSelectedType(Number(value) as TagType);
            setCreateMode(false);
            setEditingTag(null);
          }}
        >
          <SelectTrigger className="w-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TagTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Formulario de crear */}
      {createMode && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Crear nuevo tag</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del tag"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') handleCancelCreate();
              }}
              autoFocus
            />
            <Button
              onClick={handleCreate}
              disabled={createTag.isPending || !newTagName.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {createTag.isPending ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={handleCancelCreate}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Lista de tags */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        ) : tags && tags.length > 0 ? (
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="bg-muted/30 rounded-lg p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                {editingTag?.id === tag.id ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editTagName}
                      onChange={(e) => setEditTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdate(tag.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                    />
                    <Button
                      size="icon"
                      onClick={() => handleUpdate(tag.id)}
                      disabled={updateTag.isPending || !editTagName.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {updateTag.isPending ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button size="icon" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{tag.name}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        ID: {tag.id}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleStartEdit(tag)}
                        disabled={createMode}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(tag.id, tag.name)}
                        disabled={deleteTag.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No hay tags de tipo "{TagTypeLabels[selectedType]}"
            </p>
            <Button
              onClick={handleStartCreate}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear el primero
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

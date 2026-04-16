import { useRef, useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Spinner } from '@/common/components/ui/spinner';
import { Plus, Pencil, Trash2, X, Check, Upload, Download } from 'lucide-react';
import { useTagsByType } from './hooks/useTagsByType.hook';
import { useCreateTag } from './hooks/useCreateTag.hook';
import { useUpdateTag } from './hooks/useUpdateTag.hook';
import { useDeleteTag } from './hooks/useDeleteTag.hook';
import { useExportTags } from './hooks/useExportTags.hook';
import { useImportTags } from './hooks/useImportTags.hook';
import { TAG_TYPE_LABELS } from './models/tag.model';
import type { Tag } from './models/tag.model';
import { downloadBase64File } from '@/common/lib/download-file';

export const TagPage = () => {
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editName, setEditName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: tags = [], isLoading } = useTagsByType(selectedType);
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

  const handleCreate = () => {
    if (!newTagName.trim() || selectedType === null) return;

    createTag.mutate(
      { name: newTagName.trim(), type: selectedType },
      {
        onSuccess: () => {
          setNewTagName('');
        },
      }
    );
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingTag(tag);
    setEditName(tag.name);
  };

  const handleSaveEdit = () => {
    if (!editingTag || !editName.trim()) return;

    updateTag.mutate(
      { id: editingTag.id, data: { name: editName.trim() } },
      {
        onSuccess: () => {
          setEditingTag(null);
          setEditName('');
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditName('');
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este tag?')) {
      deleteTag.mutate(id);
    }
  };

  return (
    <div className="space-y-6 pt-3 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Tags</h1>
           
          </div>

          <div className="flex gap-2">
            <input
              ref={importInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImport}
            />
            <Button variant="outline" onClick={handleImportClick} disabled={isExporting || isImporting}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" onClick={handleExport} disabled={isExporting || isImporting}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-muted p-6 rounded-lg space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Seleccionar Tipo</label>
          <Select
            value={selectedType?.toString() || ''}
            onValueChange={(value) => setSelectedType(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TAG_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedType !== null && (
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del tag"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button
              onClick={handleCreate}
              disabled={!newTagName.trim() || createTag.isPending}
            >
              {createTag.isPending ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {selectedType !== null && (
        <div className="bg-background border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-semibold">
              Tags de {TAG_TYPE_LABELS[selectedType]}
            </h2>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner className="h-6 w-6" />
              </div>
            ) : tags.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay tags creados para este tipo
              </p>
            ) : (
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                  >
                    {editingTag?.id === tag.id ? (
                      <>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleSaveEdit}
                          disabled={!editName.trim() || updateTag.isPending}
                        >
                          {updateTag.isPending ? (
                            <Spinner className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1">{tag.name}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleStartEdit(tag)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(tag.id)}
                          disabled={deleteTag.isPending}
                        >
                          {deleteTag.isPending ? (
                            <Spinner className="h-4 w-4" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

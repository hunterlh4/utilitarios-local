import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';
import type { Series } from '../models/series.model';
import { seriesService } from '../services/series.service';

interface SeriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (series: Series) => void;
  editingSeries: Series | null;
}

export function SeriesDialog({ open, onOpenChange, onSave, editingSeries }: SeriesDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const [imdbId, setImdbId] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (editingSeries) {
      setImdbId(editingSeries.imdbId);
      setTitle(editingSeries.title);
      setImage(editingSeries.image);
      setYear(editingSeries.year?.toString() || '');
      setRating(editingSeries.rating?.toString() || '');
      setType(editingSeries.type || '');
      setSearchQuery('');
      setSearchResults([]);
    } else {
      setImdbId('');
      setTitle('');
      setImage('');
      setYear('');
      setRating('');
      setType('');
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [editingSeries, open]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const results = await seriesService.searchImdb(searchQuery);
      setSearchResults(results.results || []);
    } catch (error) {
      console.error('Error al buscar:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = (result: any) => {
    setImdbId(result.id);
    setTitle(result.title);
    setImage(result.image);
    setYear(result.year?.toString() || '');
    setRating(result.rating?.toString() || '');
    setType(result.type || '');
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imdbId.trim() || !title.trim() || !image.trim()) {
      alert('IMDB ID, título e imagen son obligatorios');
      return;
    }

    const series: Series = {
      id: editingSeries?.id || 0,
      imdbId: imdbId.trim(),
      title: title.trim(),
      image: image.trim(),
      year: year ? parseInt(year) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
      type: type.trim() || undefined,
      status: 1, // Temporal, no se usa en create
    };

    onSave(series);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingSeries ? 'Editar Serie' : 'Agregar Serie'}</DialogTitle>
          <DialogDescription>
            {editingSeries ? 'Modifica los datos de la serie' : 'Busca en IMDB o completa manualmente'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingSeries && (
            <div className="space-y-2">
              <Label>Buscar en IMDB</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar serie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                >
                  {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex gap-3 p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                      onClick={() => handleSelectResult(result)}
                    >
                      <img src={result.image} alt={result.title} className="w-12 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.year} • {result.type} • ⭐ {result.rating}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="imdbId">
              IMDB ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="imdbId"
              placeholder="tt1234567"
              value={imdbId}
              onChange={(e) => setImdbId(e.target.value)}
              required
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Nombre de la serie"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">
              URL de Imagen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="image"
              type="url"
              placeholder="https://example.com/imagen.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                placeholder="2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                placeholder="8.5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Input
                id="type"
                placeholder="Series"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {editingSeries ? 'Guardar' : 'Agregar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

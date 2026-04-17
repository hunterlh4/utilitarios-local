import { useRef, useState } from 'react';
import { useGetAllSeries } from './hooks/useGetAllSeries.hook';
import { useAddSeries } from './hooks/useAddSeries.hook';
import { useUpdateSeriesStatus } from './hooks/useUpdateSeriesStatus.hook';
import { useExportSeries } from './hooks/useExportSeries.hook';
import { useImportSeries } from './hooks/useImportSeries.hook';
import { ContentStatus } from '@/common/enums/ver.enum';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Spinner } from '@/common/components/ui/spinner';
import { Search, Check, Clock, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { seriesService } from './services/series.service';
import { downloadBase64File } from '@/common/lib/download-file';

export const SeriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ContentStatus>(ContentStatus.Pending);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: savedSeries, isLoading: isLoadingSaved, error, refetch } = useGetAllSeries();
  const addSeries = useAddSeries();
  const updateStatus = useUpdateSeriesStatus();
  const exportSeries = useExportSeries();
  const importSeries = useImportSeries();

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const file = await exportSeries.mutateAsync();
      downloadBase64File(file.base64, file.fileName || 'series.xlsx');
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
      await importSeries.mutateAsync(file);
      await refetch();
    } finally {
      event.target.value = '';
      setIsImporting(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(true);
    // Limpiar búsqueda anterior al hacer una nueva búsqueda
    setSearchResults([]);
    
    try {
      const data = await seriesService.searchImdb(searchQuery);
      console.log('Respuesta de IMDB:', data);
      
      // Mapear los datos de IMDB al formato esperado
      const mappedResults = (data.titles || []).map((title: any) => ({
        id: title.id,
        title: title.primaryTitle || title.originalTitle,
        image: title.primaryImage?.url || '',
        year: title.startYear,
        rating: title.rating?.aggregateRating,
        type: title.type,
      }));
      
      console.log('Resultados mapeados:', mappedResults);
      setSearchResults(mappedResults);
    } catch (error) {
      console.error('Error al buscar:', error);
      toast.error('Error al buscar series');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFilter = () => {
    // Ocultar búsqueda y toggle entre próximamente y completado
    setShowResults(false);
    setFilterStatus(prev => 
      prev === ContentStatus.Pending ? ContentStatus.Completed : ContentStatus.Pending
    );
  };

  const handleSaveSeries = async (result: any) => {
    try {
      await addSeries.mutateAsync({
        imdbId: result.id,
        title: result.title,
        image: result.image,
        year: result.year,
        rating: result.rating,
        type: result.type,
      });
      toast.success('Serie guardada correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar la serie');
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === ContentStatus.Pending 
      ? ContentStatus.Completed 
      : ContentStatus.Pending;
    
    try {
      await updateStatus.mutateAsync({ id, status: newStatus });
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        {/* <h1 className="text-3xl font-bold mb-4">Series</h1> */}

        {/* Buscador */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            ref={importInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImportExcel}
          />
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Buscar series en IMDB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
          <Button 
            type="button" 
            size="icon" 
            onClick={toggleFilter}
          >
            {filterStatus === ContentStatus.Pending ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleImportClick}
            disabled={isExporting || isImporting}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleExportExcel}
            disabled={isExporting || isImporting}
          >
            <Download className="h-4 w-4" />
          </Button>
        </form>

        {/* Vista de Resultados de búsqueda */}
        {showResults && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Resultados de búsqueda ({searchResults.length})
            </h2>
            {isSearching ? (
              <div className="flex justify-center py-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
                {searchResults.map((result) => (
                  <Card key={result.id} className="overflow-hidden flex flex-col border-0 shadow-none rounded-none">
                    <CardHeader className="p-0 cursor-pointer" onClick={() => handleSaveSeries(result)}>
                      <div className="aspect-2/3 w-full overflow-hidden bg-muted">
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-2">
                      <CardTitle className="text-sm line-clamp-2 text-center">{result.title}</CardTitle>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No se encontraron resultados</p>
            )}
          </div>
        )}

        {/* Vista de Series guardadas (Próximamente / Completado) */}
        {!showResults && (
          <div>
            {/* <h2 className="text-xl font-semibold mb-4">
              {filterStatus === ContentStatus.Pending ? 'Próximamente' : 'Completado'}
            </h2> */}
            {isLoadingSaved ? (
              <div className="flex justify-center py-8">
                <Spinner className="h-8 w-8" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Error al cargar las series</p>
              </div>
            ) : savedSeries && savedSeries.filter(s => s.status === filterStatus).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
                {savedSeries
                  .filter(series => series.status === filterStatus)
                  .map((series) => (
                    <Card key={series.id} className="overflow-hidden flex flex-col border-0 shadow-none rounded-none">
                      <CardHeader 
                        className="p-0 cursor-pointer" 
                        onClick={() => handleToggleStatus(series.id, series.status)}
                      >
                        <div className="aspect-2/3 w-full overflow-hidden bg-muted">
                          <img 
                            src={series.image} 
                            alt={series.title} 
                            className="w-full h-full object-cover hover:opacity-80 transition-opacity" 
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-2">
                        <CardTitle className="text-sm line-clamp-2 text-center">{series.title}</CardTitle>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No tienes series {filterStatus === ContentStatus.Pending ? 'próximamente' : 'completadas'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

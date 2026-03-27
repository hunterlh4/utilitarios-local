import { useState } from 'react';
import { toast } from 'sonner';
import { Search, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Badge } from '@/common/components/ui/badge';
import { Card, CardContent } from '@/common/components/ui/card';
import { Spinner } from '@/common/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';

import { getQualityByColor } from '../shared/item-quality';
import { useSteamSearch } from './hooks/useSteamSearch.hook';
import { useGetAllSteamItems } from './hooks/useGetAllSteamItems.hook';
import { useAddSteamItem } from './hooks/useAddSteamItem.hook';
import { useUpdateSteamItem } from './hooks/useUpdateSteamItem.hook';
import { useDeleteSteamItem } from './hooks/useDeleteSteamItem.hook';
import { useBulkCreateSteamItems } from './hooks/useBulkCreateSteamItems.hook';
import { steamSearchService } from './services/steam-search.service';
import { SteamItemFormModal } from './components/SteamItemFormModal';
import { PRESET_ITEMS } from './data/preset-items';
import type { SteamItem } from './models/steam-item.model';
import type { CreateSteamItemDto } from './models/steam-item-request.dto';

export const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchGame, setSearchGame] = useState<1 | 2>(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SteamItem | null>(null);
  const [prefillData, setPrefillData] = useState<Partial<CreateSteamItemDto> | null>(null);

  const { search, data: searchResults, isFetching } = useSteamSearch();
  const { data: savedItems, isLoading: loadingSaved } = useGetAllSteamItems();
  const addMutation = useAddSteamItem();
  const updateMutation = useUpdateSteamItem();
  const deleteMutation = useDeleteSteamItem();
  const { bulkCreate, isPending: isBulkPending } = useBulkCreateSteamItems();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    search(searchQuery.trim(), searchGame);
  };

  const handleSaveFromSearch = (result: NonNullable<typeof searchResults>['results'][0]) => {
    const usd = result.sell_price / 100;
    const priceInSoles = parseFloat((usd * 3.75).toFixed(2));
    const imageUrl = steamSearchService.getImageUrl(result.asset_description.icon_url);
    const marketUrl = `https://steamcommunity.com/market/listings/${result.asset_description.appid}/${encodeURIComponent(result.asset_description.market_hash_name)}`;

    setPrefillData({
      externalId: result.asset_description.market_hash_name,
      name: result.name,
      image: imageUrl,
      price: priceInSoles,
      game: searchGame === 2 ? '2' : '1',
      marketUrl,
      status: '2',
    });
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenManual = () => {
    setPrefillData(null);
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: SteamItem) => {
    setEditingItem(item);
    setPrefillData(null);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('Item eliminado'),
      onError: () => toast.error('Error al eliminar'),
    });
  };

  const handleSubmit = (data: CreateSteamItemDto) => {
    const payload = prefillData ? { ...prefillData, ...data } : data;

    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: payload },
        {
          onSuccess: () => { toast.success('Item actualizado'); setModalOpen(false); },
          onError: () => toast.error('Error al actualizar'),
        }
      );
    } else {
      addMutation.mutate(payload as CreateSteamItemDto, {
        onSuccess: () => { toast.success('Item guardado'); setModalOpen(false); },
        onError: (err: any) => {
          const msg = err?.response?.data?.message ?? 'Error al guardar';
          toast.error(msg);
        },
      });
    }
  };

  const savedIds = new Set(savedItems?.map((i) => i.externalId).filter(Boolean));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Steam Items</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={isBulkPending}
            onClick={async () => {
              const result = await bulkCreate(PRESET_ITEMS);
              toast.success(`${result.created} agregados, ${result.skipped} ya existían`);
            }}
          >
            {isBulkPending ? <Spinner className="h-4 w-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
            Importar preset
          </Button>
          <Button onClick={handleOpenManual} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Agregar manual
          </Button>
        </div>
      </div>

      {/* Buscador */}
      <form
        className="flex gap-2"
        onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
      >
        <Select value={String(searchGame)} onValueChange={(v) => setSearchGame(Number(v) as 1 | 2)}>
          <SelectTrigger className="w-32 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Dota 2</SelectItem>
            <SelectItem value="2">CS2</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Buscar en Steam Market..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" size="sm" disabled={isFetching} className="px-3">
          {isFetching ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {/* Resultados de búsqueda */}
      {searchResults && searchResults.results?.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {searchResults.total_count} resultados — mostrando {searchResults.results.length}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
            {searchResults.results.map((result) => {
              const alreadySaved = savedIds.has(result.asset_description.market_hash_name);
              const imageUrl = steamSearchService.getImageUrl(result.asset_description.icon_url);
              const price = steamSearchService.convertToSoles(result.sell_price);
              const quality = result.asset_description.name_color
                ? getQualityByColor(result.asset_description.name_color)
                : undefined;
              return (
                <Card
                  key={result.hash_name}
                  className="overflow-hidden flex flex-col border-0 shadow-none rounded-none"
                >
                  <div
                    className="aspect-square w-full overflow-hidden bg-muted cursor-pointer relative group"
                    onClick={() => !alreadySaved && handleSaveFromSearch(result)}
                  >
                    <img
                      src={imageUrl}
                      alt={result.name}
                      className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-200"
                    />
                    {alreadySaved && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Badge variant="secondary">Guardado</Badge>
                      </div>
                    )}
                    {!alreadySaved && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Plus className="w-8 h-8 text-white drop-shadow" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-2 space-y-0.5">
                    {quality && (
                      <span className={`text-[10px] font-medium border rounded px-1 py-0.5 ${quality.borderClass} text-foreground`}>
                        {quality.label}
                      </span>
                    )}
                    <p className="text-xs line-clamp-2 leading-tight">{result.name}</p>
                    <p className="text-sm font-semibold">{price}</p>
                    <p className="text-xs text-muted-foreground">{result.sell_listings} en venta</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {searchResults && searchResults.results?.length === 0 && (
        <p className="text-sm text-muted-foreground">Sin resultados para "{searchQuery}"</p>
      )}

      {/* Lista de items guardados */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Items guardados</h2>
        {loadingSaved ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        ) : !savedItems?.length ? (
          <p className="text-sm text-muted-foreground">No hay items guardados aún.</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-0">
            {savedItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden flex flex-col border-0 shadow-none rounded-none cursor-pointer group"
                onClick={() => handleEdit(item)}
              >
                <div className="aspect-square w-full overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                  />
                  <button
                    className="absolute top-1 right-1 p-1 rounded bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
                <CardContent className="p-2 space-y-0.5">
                  <p className="text-xs line-clamp-2 leading-tight">{item.name}</p>
                  <p className="text-sm font-semibold">
                    {item.price != null ? `S/. ${item.price}` : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.game === '1' ? 'Dota 2' : 'CS2'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <SteamItemFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        item={editingItem ?? (prefillData ? ({ ...prefillData, id: 0, createdAt: '' } as SteamItem) : null)}
        isPending={addMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

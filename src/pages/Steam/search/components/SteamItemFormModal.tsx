import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import type { SteamItem } from '../models/steam-item.model';
import type { CreateSteamItemDto } from '../models/steam-item-request.dto';

interface FormValues {
  externalId?: string;
  name: string;
  image: string;
  priceInput: string;
  game: '1' | '2';
  marketUrl: string;
  status: '1' | '2';
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSteamItemDto) => void;
  item?: SteamItem | null;
  isPending?: boolean;
}

export const SteamItemFormModal = ({ open, onClose, onSubmit, item, isPending }: Props) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    defaultValues: { game: '1', status: '2', priceInput: '' },
  });

  useEffect(() => {
    if (item) {
      reset({
        externalId: item.externalId ?? '',
        name: item.name,
        image: item.image,
        priceInput: item.price != null ? String(item.price) : '',
        game: String(item.game) as '1' | '2',
        marketUrl: item.marketUrl,
        status: String(item.status) as '1' | '2',
      });
    } else {
      reset({ game: '1', status: '2', priceInput: '' });
    }
  }, [item, reset]);

  const handleFormSubmit = (values: FormValues) => {
    const parsed = parseFloat(values.priceInput);
    onSubmit({
      externalId: values.externalId,
      name: values.name,
      image: values.image,
      price: isNaN(parsed) ? undefined : parsed,
      game: values.game,
      marketUrl: values.marketUrl,
      status: values.status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? 'Editar item' : 'Agregar item manualmente'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
          <div>
            <Label>External ID (Steam)</Label>
            <Input {...register('externalId')} placeholder="market_hash_name o classid" />
          </div>
          <div>
            <Label>Nombre *</Label>
            <Input {...register('name', { required: true })} placeholder="Nombre del item" />
          </div>
          <div>
            <Label>Imagen URL *</Label>
            <Input {...register('image', { required: true })} placeholder="URL de la imagen" />
          </div>
          <div>
            <Label>Precio (S/.)</Label>
            <Input {...register('priceInput')} placeholder="2.50" type="number" step="0.01" />
          </div>
          <div>
            <Label>URL de mercado *</Label>
            <Input {...register('marketUrl', { required: true })} placeholder="https://steamcommunity.com/market/..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Juego</Label>
              <Select value={watch('game')} onValueChange={(v) => setValue('game', v as '1' | '2')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Dota 2</SelectItem>
                  <SelectItem value="2">CS2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estado</Label>
              <Select value={watch('status')} onValueChange={(v) => setValue('status', v as '1' | '2')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Historial</SelectItem>
                  <SelectItem value="2">Por comprar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : item ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

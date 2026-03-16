import { useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Textarea } from '@/common/components/ui/textarea';
import { Spinner } from '@/common/components/ui/spinner';
import { toast } from 'sonner';

interface BulkCreateActressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateActresses: (names: string[]) => Promise<void>;
}

export const BulkCreateActressDialog = ({
  open,
  onOpenChange,
  onCreateActresses,
}: BulkCreateActressDialogProps) => {
  const [namesText, setNamesText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    const names = namesText
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length === 0) {
      toast.error('Por favor ingresa al menos un nombre');
      return;
    }

    setIsLoading(true);
    try {
      await onCreateActresses(names);
      toast.success(`${names.length} actriz(ces) creadas correctamente`);
      setNamesText('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error al crear actrices:', error);
      toast.error('Error al crear las actrices');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear múltiples actrices</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Ingresa los nombres (uno por línea)
            </label>
            <Textarea
              placeholder={`Morgpie leaks\nNaomi Hughes\nnnnnekochan\nKari Keone`}
              value={namesText}
              onChange={(e) => setNamesText(e.target.value)}
              className="min-h-32"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {namesText.split('\n').filter(n => n.trim()).length} nombre(s) listo(s) para crear
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Creando...
                </>
              ) : (
                'Crear actrices'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

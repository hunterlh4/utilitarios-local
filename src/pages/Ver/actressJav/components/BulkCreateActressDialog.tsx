import { useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Textarea } from '@/common/components/ui/textarea';
import { Spinner } from '@/common/components/ui/spinner';

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
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCreate = async () => {
    // Divide por salto de línea O por coma, limpia espacios y filtra vacíos
    const names = namesText
      .split(/[\n,]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length === 0) {
      setValidationError('Por favor ingresa al menos un nombre');
      return;
    }

    setValidationError(null);
    setIsLoading(true);
    try {
      await onCreateActresses(names);
      setNamesText('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error al crear actrices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear multiples actrices JAV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Ingresa los nombres (uno por línea o separados por coma)
            </label>
            <Textarea
              placeholder={`Matsuri Kiritani\nKaho Shibuya, Maria Ozawa\nAi Sayama`}
              value={namesText}
              onChange={(e) => setNamesText(e.target.value)}
              className="min-h-32"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {namesText.split(/[\n,]/).filter(n => n.trim()).length} nombre(s) listo(s) para crear
            </p>
            {validationError && <p className="text-xs text-red-500 mt-1">{validationError}</p>}
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

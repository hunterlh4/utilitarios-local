import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Textarea } from '@/common/components/ui/textarea';
import { Copy, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface ExtractCodesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExtractCodesDialog = ({ open, onOpenChange }: ExtractCodesDialogProps) => {
  const [inputText, setInputText] = useState('');
  const [extractedCodes, setExtractedCodes] = useState('');
  const [matchedLines, setMatchedLines] = useState('');
  const [unmatchedLines, setUnmatchedLines] = useState('');

  const extractCodes = () => {
    // Regex para capturar códigos JAV: 3-5 letras, guión o +, 3-4 números
    const codeRegex = /\b([a-zA-Z]{3,5}[-+]\d{3,4})\b/gi;
    
    const lines = inputText.split('\n').filter(line => line.trim());
    const matched: string[] = [];
    const unmatched: string[] = [];
    const codes: string[] = [];
    
    lines.forEach(line => {
      const lineMatches = line.match(codeRegex);
      if (lineMatches && lineMatches.length > 0) {
        matched.push(line);
        lineMatches.forEach(code => codes.push(code.toUpperCase()));
      } else {
        unmatched.push(line);
      }
    });
    
    if (codes.length > 0) {
      // Eliminar duplicados
      const uniqueCodes = [...new Set(codes)];
      setExtractedCodes(uniqueCodes.join('\n'));
      setMatchedLines(matched.join('\n'));
      setUnmatchedLines(unmatched.join('\n'));
      toast.success(`${uniqueCodes.length} códigos extraídos`);
    } else {
      setExtractedCodes('');
      setMatchedLines('');
      setUnmatchedLines(lines.join('\n'));
      toast.error('No se encontraron códigos JAV');
    }
  };

  const handleCopy = () => {
    if (extractedCodes) {
      navigator.clipboard.writeText(extractedCodes);
      toast.success('Códigos copiados al portapapeles');
    }
  };

  const handleClear = () => {
    setInputText('');
    setExtractedCodes('');
    setMatchedLines('');
    setUnmatchedLines('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Extraer Códigos JAV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {/* Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center h-8">
                <label className="text-sm font-medium">
                  URLs y Texto ({inputText.split('\n').filter(line => line.trim()).length} líneas)
                </label>
                <Button size="sm" variant="ghost" onClick={handleClear} className="h-7">
                  Limpiar
                </Button>
              </div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pega aquí las URLs o texto con códigos JAV..."
                className="min-h-[500px] w-full font-mono text-sm overflow-x-auto whitespace-nowrap"
              />
            </div>

            {/* Output - Códigos */}
            <div className="space-y-2">
              <div className="flex justify-between items-center h-8">
                <label className="text-sm font-medium">
                  Códigos Extraídos ({extractedCodes.split('\n').filter(line => line.trim()).length} códigos)
                </label>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleCopy}
                  disabled={!extractedCodes}
                  className="h-7"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
              </div>
              <Textarea
                value={extractedCodes}
                readOnly
                placeholder="Los códigos aparecerán aquí..."
                className="min-h-[500px] w-full font-mono text-sm bg-muted"
              />
            </div>

            {/* Líneas con código */}
            <div className="space-y-2">
              <div className="h-8 flex items-center">
                <label className="text-sm font-medium text-green-600">
                  Con Código ({matchedLines.split('\n').filter(line => line.trim()).length} líneas)
                </label>
              </div>
              <Textarea
                value={matchedLines}
                readOnly
                placeholder="Líneas que contienen códigos..."
                className="min-h-[500px] w-full font-mono text-xs bg-green-50 dark:bg-green-950/20 overflow-x-auto whitespace-nowrap"
              />
            </div>

            {/* Líneas sin código */}
            <div className="space-y-2">
              <div className="h-8 flex items-center">
                <label className="text-sm font-medium text-red-600">
                  Sin Código ({unmatchedLines.split('\n').filter(line => line.trim()).length} líneas)
                </label>
              </div>
              <Textarea
                value={unmatchedLines}
                readOnly
                placeholder="Líneas sin códigos..."
                className="min-h-[500px] w-full font-mono text-xs bg-red-50 dark:bg-red-950/20 overflow-x-auto whitespace-nowrap"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={extractCodes} className="bg-blue-600 hover:bg-blue-700">
              <ArrowRight className="h-4 w-4 mr-2" />
              Extraer Códigos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

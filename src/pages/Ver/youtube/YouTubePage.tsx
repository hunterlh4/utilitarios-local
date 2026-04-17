import { useRef, useState } from 'react';
import { Button } from '@/common/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { downloadBase64File } from '@/common/lib/download-file';
import { useGetAllYouTube } from './hooks/useGetAllYouTube.hook';
import { useExportYouTube } from './hooks/useExportYouTube.hook';
import { useImportYouTube } from './hooks/useImportYouTube.hook';

export const YouTubePage = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: videos, refetch } = useGetAllYouTube();
  const exportYouTube = useExportYouTube();
  const importYouTube = useImportYouTube();

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const file = await exportYouTube.mutateAsync();
      downloadBase64File(file.base64, file.fileName || 'youtube.xlsx');
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
      await importYouTube.mutateAsync(file);
      await refetch();
    } finally {
      event.target.value = '';
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* <h1 className="text-3xl font-bold">YouTube</h1> */}
      <div className="flex items-center gap-2">
        <input
          ref={importInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleImportExcel}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleImportClick}
          disabled={isExporting || isImporting}
        >
          <Upload className="h-4 w-4 mr-2" />
          Importar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleExportExcel}
          disabled={isExporting || isImporting}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Registros actuales: {videos?.length ?? 0}</p>
    </div>
  );
};

export type ExcelFileDto = {
  fileName: string;
  base64: string;
};

export type ImportExcelResult = {
  created: number;
  updated: number;
  skipped: number;
  invalid: number;
};

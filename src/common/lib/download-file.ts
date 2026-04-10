export const downloadBase64File = (base64Value: string, fileName: string) => {
  if (!base64Value) return;

  const commaIndex = base64Value.indexOf(',');
  const hasDataUri = commaIndex !== -1 && base64Value.startsWith('data:');

  const mimeType = hasDataUri
    ? base64Value.substring(5, base64Value.indexOf(';'))
    : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  const rawBase64 = hasDataUri ? base64Value.substring(commaIndex + 1) : base64Value;
  const binary = atob(rawBase64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

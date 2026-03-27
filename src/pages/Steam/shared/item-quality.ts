export interface ItemQuality {
  label: string;
  borderClass: string;
}

// Por name_color del API de Steam
const QUALITY_BY_COLOR: Record<string, ItemQuality> = {
  '4D7455': { label: 'Genuine',     borderClass: 'border-[#4D7455]' },
  'CF6A32': { label: 'Inscribed',   borderClass: 'border-[#CF6A32]' },
  'A52A2A': { label: 'Corrupted',   borderClass: 'border-[#A52A2A]' },
  'ADE55C': { label: 'Autographed', borderClass: 'border-[#ADE55C]' },
  'CCCCCC': { label: 'Exalted',     borderClass: 'border-[#CCCCCC]' },
};

// Por prefijo del nombre del item
const QUALITY_BY_NAME: Array<{ prefix: string; quality: ItemQuality }> = [
  { prefix: 'Genuine ',     quality: { label: 'Genuine',     borderClass: 'border-[#4D7455]' } },
  { prefix: 'Inscribed ',   quality: { label: 'Inscribed',   borderClass: 'border-[#CF6A32]' } },
  { prefix: 'Corrupted ',   quality: { label: 'Corrupted',   borderClass: 'border-[#A52A2A]' } },
  { prefix: 'Autographed ', quality: { label: 'Autographed', borderClass: 'border-[#ADE55C]' } },
  { prefix: 'Exalted ',     quality: { label: 'Exalted',     borderClass: 'border-[#CCCCCC]' } },
  { prefix: 'StatTrak™ ',   quality: { label: 'StatTrak™',   borderClass: 'border-[#CF6A32]' } },
];

export const getQualityByColor = (nameColor?: string): ItemQuality | undefined =>
  nameColor ? QUALITY_BY_COLOR[nameColor.toUpperCase()] : undefined;

export const getQualityByName = (name: string): ItemQuality | undefined =>
  QUALITY_BY_NAME.find(({ prefix }) => name.startsWith(prefix))?.quality;

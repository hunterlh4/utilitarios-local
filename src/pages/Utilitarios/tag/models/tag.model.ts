export interface Tag {
  id: number;
  name: string;
  type: number;
}

export const TAG_TYPES = {
  ACTRESS_JAV: 1,
  PROJECT: 2,
  POST: 3,
  OTHER: 4,
  ACTRESS_ADULT: 5,
  HENTAI: 6,
  JAV: 7,
  VIDEO_ADULT: 8,
} as const;

export const TAG_TYPE_LABELS: Record<number, string> = {
  [TAG_TYPES.ACTRESS_JAV]: 'Actriz JAV',
  [TAG_TYPES.PROJECT]: 'Proyecto',
  [TAG_TYPES.POST]: 'Post',
  [TAG_TYPES.OTHER]: 'Otro',
  [TAG_TYPES.ACTRESS_ADULT]: 'Actriz Adult',
  [TAG_TYPES.HENTAI]: 'Hentai',
  [TAG_TYPES.JAV]: 'JAV',
  [TAG_TYPES.VIDEO_ADULT]: 'Video Adult',
};

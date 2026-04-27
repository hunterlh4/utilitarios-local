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
  [TAG_TYPES.PROJECT]: 'Projecto',
  [TAG_TYPES.POST]: 'Post',
  [TAG_TYPES.OTHER]: 'Otro',
  [TAG_TYPES.ACTRESS_ADULT]: 'Actriz Adult',
  [TAG_TYPES.HENTAI]: 'Hentai',
  [TAG_TYPES.JAV]: 'JAV',
  [TAG_TYPES.VIDEO_ADULT]: 'Video Adult',
};

export const TAG_TABS = [
  { type: TAG_TYPES.ACTRESS_JAV, label: TAG_TYPE_LABELS[TAG_TYPES.ACTRESS_JAV], path: 'actress-jav' },
  { type: TAG_TYPES.PROJECT, label: TAG_TYPE_LABELS[TAG_TYPES.PROJECT], path: 'project' },
  { type: TAG_TYPES.POST, label: TAG_TYPE_LABELS[TAG_TYPES.POST], path: 'post' },
  { type: TAG_TYPES.OTHER, label: TAG_TYPE_LABELS[TAG_TYPES.OTHER], path: 'other' },
  { type: TAG_TYPES.ACTRESS_ADULT, label: TAG_TYPE_LABELS[TAG_TYPES.ACTRESS_ADULT], path: 'actress-adult' },
  { type: TAG_TYPES.HENTAI, label: TAG_TYPE_LABELS[TAG_TYPES.HENTAI], path: 'hentai' },
  { type: TAG_TYPES.JAV, label: TAG_TYPE_LABELS[TAG_TYPES.JAV], path: 'jav' },
  { type: TAG_TYPES.VIDEO_ADULT, label: TAG_TYPE_LABELS[TAG_TYPES.VIDEO_ADULT], path: 'video-adult' },
] as const;

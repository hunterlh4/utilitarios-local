export enum TagType {
  ActressJav = 1,
  Project = 2,
  Post = 3,
  Other = 4,
  ActressAdult = 5,
  Hentai = 6,
  Jav = 7,
  VideoAdult = 8,
}

export const TagTypeLabels: Record<TagType, string> = {
  [TagType.ActressJav]: 'Actriz JAV',
  [TagType.Project]: 'Proyecto',
  [TagType.Post]: 'Post',
  [TagType.Other]: 'Otro',
  [TagType.ActressAdult]: 'Actriz Adult',
  [TagType.Hentai]: 'Hentai',
  [TagType.Jav]: 'JAV',
  [TagType.VideoAdult]: 'Video Adult',
};

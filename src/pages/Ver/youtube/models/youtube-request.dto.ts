export interface CreateYouTubeDto {
  url: string;
  title: string;
  authorName?: string;
  authorUrl?: string;
  type?: string;
  height?: number;
  width?: number;
  version?: string;
  providerName?: string;
  providerUrl?: string;
  thumbnailHeight?: number;
  thumbnailWidth?: number;
  thumbnailUrl?: string;
  html?: string;
  category: '1' | '2' | '3' | '4';
}

export interface UpdateYouTubeDto extends Partial<CreateYouTubeDto> {}

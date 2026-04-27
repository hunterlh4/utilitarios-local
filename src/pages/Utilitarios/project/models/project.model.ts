export interface Project {
  id: number;
  name: string;
  description?: string;
  url?: string;
  firstImageUrl?: string;
  tags: string[];
  createdAt: string;
}

export interface ProjectLink {
  id: number;
  name?: string;
  url: string;
  orderIndex?: number;
}

export interface ProjectDetail extends Project {
  media: { id: number; url: string; thumbnail?: string; orderIndex: number }[];
  links: ProjectLink[];
}

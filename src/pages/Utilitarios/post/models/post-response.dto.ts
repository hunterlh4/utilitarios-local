import { Post } from './post.model';

export interface GetAllPostsResponse {
  data: Post[];
  total: number;
}

export interface GetPostByIdResponse {
  data: Post;
}

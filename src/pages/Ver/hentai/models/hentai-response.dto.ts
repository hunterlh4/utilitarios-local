import type { ApiResponse, PaginatedResponse } from '@/config/models/base.model';
import type { Hentai } from './hentai.model';

export type GetHentaiListResponse = PaginatedResponse<Hentai>;
export type GetHentaiByIdResponse = ApiResponse<Hentai>;
export type CreateHentaiResponse = ApiResponse<{ id: number }>;
export type UpdateHentaiResponse = ApiResponse<{ id: number }>;

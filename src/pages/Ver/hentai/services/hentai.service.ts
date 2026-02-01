import { ApiService } from '@/config/api/api.service';
import type {
  GetHentaiListResponse,
  GetHentaiByIdResponse,
  CreateHentaiResponse,
  UpdateHentaiResponse,
} from '../models/hentai-response.dto';
import type {
  CreateHentaiRequest,
  UpdateHentaiRequest,
  GetHentaiListRequest,
} from '../models/hentai-request.dto';
import type { Hentai } from '../models/hentai.model';

export class HentaiService {
  static async getAll(params: GetHentaiListRequest): Promise<GetHentaiListResponse> {
    return ApiService.get<GetHentaiListResponse>('/hentai', params);
  }

  static async getById(id: number): Promise<Hentai> {
    const response = await ApiService.get<GetHentaiByIdResponse>(`/hentai/${id}`);
    return response.data;
  }

  static async create(data: CreateHentaiRequest): Promise<number> {
    const response = await ApiService.post<CreateHentaiResponse>('/hentai', data);
    return response.data.id;
  }

  static async update(id: number, data: UpdateHentaiRequest): Promise<number> {
    const response = await ApiService.put<UpdateHentaiResponse>(`/hentai/${id}`, data);
    return response.data.id;
  }

  static async delete(id: number): Promise<void> {
    await ApiService.delete<void>(`/hentai/${id}`);
  }
}

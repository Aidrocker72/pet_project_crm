export interface IApiClient {
  request<T>(endpoint: string, options?: RequestInit): Promise<T>;
  getAuthToken(): string | null;
  get<T>(endpoint: string, headers?: HeadersInit): Promise<T>;
  post<T, D = any>(endpoint: string, data?: D, headers?: HeadersInit): Promise<T>;
  put<T, D = any>(endpoint: string, data?: D, headers?: HeadersInit): Promise<T>;
  delete<T>(endpoint: string, headers?: HeadersInit): Promise<T>;
}

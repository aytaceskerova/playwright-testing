import type { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApi {
  protected readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async get(url: string): Promise<APIResponse> {
    return this.request.get(url);
  }

  async post<T extends object>(url: string, data?: T): Promise<APIResponse> {
    return this.request.post(url, { data });
  }

  async put<T extends object>(url: string, data?: T): Promise<APIResponse> {
    return this.request.put(url, { data });
  }

  async delete(url: string): Promise<APIResponse> {
    return this.request.delete(url);
  }

  async patch<T extends object>(url: string, data?: T): Promise<APIResponse> {
    return this.request.patch(url, { data });
  }
}

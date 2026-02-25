import type { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApi {
  protected readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async get(url: string): Promise<APIResponse> {
    return this.request.get(url);
  }

  async post(url: string, data?: unknown): Promise<APIResponse> {
    return this.request.post(url, { data });
  }

  async put(url: string, data?: unknown): Promise<APIResponse> {
    return this.request.put(url, { data });
  }

  async delete(url: string): Promise<APIResponse> {
    return this.request.delete(url);
  }

  async patch(url: string, data?: unknown): Promise<APIResponse> {
    return this.request.patch(url, { data });
  }
}

import type { APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';
import { API_ENDPOINTS } from '../data/constants/apiConfig';
import type { CourseFilterBody } from '../data/dto/course';

export class CourseApi extends BaseApi {
  async filterCourses(filter: CourseFilterBody): Promise<APIResponse> {
    return this.post(API_ENDPOINTS.SecuredCourseFilter, filter);
  }

  async getCourses(): Promise<APIResponse> {
    return this.get(API_ENDPOINTS.SecuredCourse);
  }

  async getCourseTypes(): Promise<APIResponse> {
    return this.get(API_ENDPOINTS.SecuredCourseTypes);
  }

  async getCourseLanguages(): Promise<APIResponse> {
    return this.get(API_ENDPOINTS.SecuredCourseLanguages);
  }

  async getCourseCountries(): Promise<APIResponse> {
    return this.get(API_ENDPOINTS.SecuredCourseCountries);
  }
}

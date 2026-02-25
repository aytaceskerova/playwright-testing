export interface CourseFilterBody {
  language: string;
  type: string;
}

export interface Course {
  name: string;
  country: string;
  language: string;
  type: string;
  startDate: string;
}

export interface CoursesResponse {
  courses: Course[];
}

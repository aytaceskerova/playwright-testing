export const API_CONFIG = {
  BaseUrl: 'https://qa-course-01-api.andersenlab.com',
  Login: {
    Email: 'aytaceskerova2+1@gmail.com',
    Password: 'Aytac1110',
  },
} as const;

export const API_ENDPOINTS = {
  PublicRegistration: '/api/public/registration',
  PublicLogin: '/api/public/login',
  SecuredCourse: '/api/secured/course',
  SecuredCourseFilter: '/api/secured/course/filter',
  SecuredCourseTypes: '/api/secured/course/types',
  SecuredCourseLanguages: '/api/secured/course/languages',
  SecuredCourseCountries: '/api/secured/course/countries',
} as const;

export const SELECT_PAGE_LABELS = {
  ChooseYourCourse: 'Choose your course',
  DefineStudyPreferences: 'Define your study preferences',
  SelectCountry: 'Select country',
  SelectLanguage: 'Select language',
  SelectType: 'Select type',
  DateFrom: 'Date from',
  DateTo: 'Date to',
  SelectCourses: 'Select courses',
  BackToProfile: 'Back to profile',
  Search: 'Search',
} as const;

export const SELECT_FILTER_VALUES = {
  Country: {
    Italy: 'Italy',
  },
  Language: {
    Dutch: 'Dutch',
  },
  Type: {
    Testing: 'Testing',
  },
} as const;

export const NO_COURSES_MESSAGE =
  'Unfortunately, we did not find any courses matching your chosen criteria.';

export const SELECT_DATE_VALUES = {
  StartDate: '2026-02-20',
} as const;

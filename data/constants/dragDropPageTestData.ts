export const DRAG_DROP_PAGE_LABELS = {
  BackToProfile: 'Back to profile',
  SortYourResponsibilities: 'Sort your responsibilities',
  PlaceTheBlocksSubtitle: 'Place the blocks into the cells below',
  ManualWork: 'Manual Work',
  AutomationWork: 'Automation Work',
  Finish: 'Finish',
} as const;

export const FINISH_BUTTON_ENABLED_CLASS = /bg-\[#feda00\]/;

export const DRAG_DROP_CHIPS = [
  'Write test cases',
  'Testing requirements',
  'Write automation scripts',
  'Framework set up',
] as const;

export const CONGRATULATIONS_MESSAGE = "Congratulations! Let's test for the best!";

export const CHIP_TO_SECTION = {
  'Write test cases': 'Manual Work',
  'Testing requirements': 'Manual Work',
  'Write automation scripts': 'Automation Work',
  'Framework set up': 'Automation Work',
} as const;

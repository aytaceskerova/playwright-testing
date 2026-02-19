export const URL_PATTERNS = {
  Login: /.*login/,
  Registration: /.*registration/,
  Select: /.*select/,
  DragDrop: /.*drag-drop/,
  UserProfile: /\/(profile\/?)?$|^\/$/,
} as const;

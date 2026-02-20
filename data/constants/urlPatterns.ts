export const URL_PATTERNS = {
  Login: /.*login/,
  Registration: /.*registration/,
  Select: /.*select/,
  DragDrop: /.*drag-drop/,
  ActionsAlertsIframes: /.*\/actions\/?/,
  UserProfile: /\/(profile\/?)?$|^\/$/,
} as const;

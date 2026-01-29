export const enum CssPattern {
  ErrorBorderColor = 'rgb\\(2\\d{2}',
}
export const ERROR_BORDER_COLOR = new RegExp(CssPattern.ErrorBorderColor);

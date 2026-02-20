export const ACTIONS_ALERTS_IFRAMES_PAGE_LABELS = {
  Back: 'Back',
  Title: 'Your application has been accepted!',
  Subtitle: 'Click one of the buttons to complete your registration on Default course',
  Confirm: 'Confirm',
  GetDiscount: 'Get Discount',
  CancelCourse: 'Cancel course',
  Results: 'Results:',
  Finish: 'Finish',
} as const;

export const BUTTON_HINTS = {
  Confirm: 'Click the button to open a JavaScript alert',
  GetDiscount: 'Double click the button to open a JavaScript confirm',
  CancelCourse: 'Right click to open a JavaScript prompt',
} as const;

export const ALERT_MESSAGES = {
  ConfirmAlert: 'You have called alert!',
  GetDiscountConfirm: 'Are you sure you want to apply the discount?',
  CancelCoursePrompt:
    'Here you may describe a reason why you are cancelling your registration (or leave this field empty).',
} as const;

export const RESULT_MESSAGES = {
  Enrolled: 'Congratulations, you have successfully enrolled in the course!',
  DiscountApplied: 'You received a 10% discount on the second course.',
  CancelledWithReason: (reason: string) =>
    `Your course application has been cancelled. Reason: ${reason}`,
  CancelledDefaultReason: 'Your course application has been cancelled. Reason: You did not notice any reason.',
} as const;

export const FINISH_BUTTON_ENABLED_CLASS = /bg-\[#feda00\]/;

export const CANCEL_REASON = 'Test reason';

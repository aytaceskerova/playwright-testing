import { RegistrationData } from '../../types/registration';
export const ERROR_BORDER_COLOR = /rgb\(2\d{2}/;
export const enum PasswordTestData {
  Min = 'Test1234',
  MinMinus = 'Test123',
  Max = 'AAAAAAAAAAAAAAAAAAAA',
  MaxPlus = 'AAAAAAAAAAAAAAAAAAAAA',
}
export type SignInUser = {
  email: string;
  password: string;
};
export const createValidUser = (): SignInUser => ({
  email: `test${Date.now()}@example.com`,
  password: 'TestPassword123',
});
export const createRegistrationData = (user: SignInUser): RegistrationData => ({
  firstName: 'Ai',
  lastName: 'Kai',
  dateOfBirth: '2000-01-15',
  email: user.email,
  password: user.password,
  confirmPassword: user.password,
});

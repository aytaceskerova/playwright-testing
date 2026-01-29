import { RegistrationData } from '../types/registration';
export class RegistrationTestData implements RegistrationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;
  constructor(params: Partial<RegistrationTestData> = {}) {
    this.firstName = params.firstName ?? 'Ai';
    this.lastName = params.lastName ?? 'Kai';
    this.dateOfBirth = params.dateOfBirth ?? '2000-01-15';
    const unique = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    this.email = params.email ?? `test${unique}@example.com`;
    this.password = params.password ?? 'TestPassword123';
    this.confirmPassword = params.confirmPassword ?? this.password;
  }
}

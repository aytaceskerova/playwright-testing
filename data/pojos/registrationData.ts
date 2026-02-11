import { RegistrationData } from '../../types/registration';
import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../constants/emailConstants';
import { REGISTRATION_DEFAULTS } from '../constants/registrationDefaults';

export class RegistrationTestData implements RegistrationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;

  constructor(params: Partial<RegistrationTestData> = {}) {
    this.firstName = params.firstName ?? REGISTRATION_DEFAULTS.FirstName;
    this.lastName = params.lastName ?? REGISTRATION_DEFAULTS.LastName;
    this.dateOfBirth = params.dateOfBirth ?? REGISTRATION_DEFAULTS.DateOfBirth;
    const unique = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    this.email = params.email ?? `${EMAIL_PREFIXES.Base}${unique}@${EMAIL_DOMAIN}`;
    this.password = params.password ?? REGISTRATION_DEFAULTS.Password;
    this.confirmPassword = params.confirmPassword ?? this.password;
  }
}

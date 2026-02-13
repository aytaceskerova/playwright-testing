import { EMAIL_DOMAIN, EMAIL_PREFIXES } from '../data/constants/emailConstants';

export class TextGenerator {
  static uniqueEmail(prefix: string = EMAIL_PREFIXES.Base): string {
    const unique = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    return `${prefix}${unique}@${EMAIL_DOMAIN}`;
  }

  static uniqueUpdatedEmail(): string {
    return this.uniqueEmail(EMAIL_PREFIXES.Updated);
  }

  static uniqueNotRegisteredEmail(): string {
    return this.uniqueEmail(EMAIL_PREFIXES.NotRegistered);
  }

  static randomName(length: number = 5): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  static randomFirstName(): string {
    return this.randomName();
  }

  static randomLastName(): string {
    return this.randomName();
  }
}

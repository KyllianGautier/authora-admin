import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// --- DTOs ---

export interface PasswordRulesOutput {
  minLength: number;
  requireDigit: boolean;
  requireSpecialChar: boolean;
  requireLowercase: boolean;
  requireUppercase: boolean;
  forbidSequentialChars: boolean;
  forbidRepeatedChars: boolean;
  forbidKeyboardSequence: boolean;
  forbidUserInfo: boolean;
  forbidCommonPassword: boolean;
}

export interface CheckPasswordStrengthOutput {
  valid: boolean;
  errors: string[];
}

export interface CheckEmailOutput {
  message: string;
}

export interface SignUpOutput {
  id: string;
  email: string;
  createdAt: string;
}

// --- Service ---

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1';

  // Sign-up
  signUp(email: string, password: string): Observable<SignUpOutput> {
    return this.http.post<SignUpOutput>(`${this.baseUrl}/sign-up`, { email, password });
  }

  checkEmail(email: string): Observable<boolean> {
    const availableMessage = 'You can continue the registration process if this email is valid.';
    return this.http
      .post<CheckEmailOutput>(`${this.baseUrl}/sign-up/check-email`, { email })
      .pipe(map(({ message }) => message === availableMessage));
  }

  // Password
  getPasswordRules(): Observable<PasswordRulesOutput> {
    return this.http.get<PasswordRulesOutput>(`${this.baseUrl}/password/rules`);
  }

  checkPasswordStrength(password: string, email?: string): Observable<CheckPasswordStrengthOutput> {
    const body: Record<string, string> = { password };
    if (email) body['email'] = email;
    return this.http.post<CheckPasswordStrengthOutput>(
      `${this.baseUrl}/password/check-strength`,
      body
    );
  }
}

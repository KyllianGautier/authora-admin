import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingKey, UpsertSettingInput } from '@kylliangautier/authora-types';

export { SettingKey };
export type { UpsertSettingInput };

// --- DTOs ---

export interface AdminSignInInput {
  username: string;
  password: string;
}

export interface AdminSignInOutput {
  accessToken: string;
  type: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  email: string;
  emailVerificationTokenExpiresAt: string;
  createdAt: string;
}

export type OneTimeTokenType =
  | 'MFA_VERIFY'
  | 'MFA_VALIDATE'
  | 'MFA_DISABLING'
  | 'ACCOUNT_DELETION'
  | 'FORGOT_PASSWORD'
  | 'MAGIC_LINK';

export interface OneTimeToken {
  id: string;
  type: OneTimeTokenType;
  revoked: boolean;
  expiredAt: string;
  createdAt: string;
}

export interface Password {
  id: string;
  revoked: boolean;
  createdAt: string;
}

export interface RefreshToken {
  id: string;
  revoked: boolean;
  expiredAt: string;
  createdAt: string;
}

export interface Mfa {
  id: string;
  isVerified: boolean;
  recoveryCodeCount: number;
  createdAt: string;
}

export interface Setting {
  key: string;
  value: string | number | boolean;
}

// --- Service ---

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/admin';

  // Auth
  signIn(input: AdminSignInInput): Observable<AdminSignInOutput> {
    return this.http.post<AdminSignInOutput>(`${this.baseUrl}/auth/sign-in`, input);
  }

  // Registrations
  getRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.baseUrl}/registrations`);
  }

  getRegistrationById(id: string): Observable<Registration> {
    return this.http.get<Registration>(`${this.baseUrl}/registrations/${id}`);
  }

  deleteRegistration(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/registrations/${id}`);
  }

  deleteManyRegistrations(ids: string[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/registrations`, { body: { ids } });
  }

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  deleteManyUsers(ids: string[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users`, { body: { ids } });
  }

  // User — One-Time Tokens
  getUserOneTimeTokens(userId: string): Observable<OneTimeToken[]> {
    return this.http.get<OneTimeToken[]>(`${this.baseUrl}/users/${userId}/one-time-tokens`);
  }

  revokeUserOneTimeToken(userId: string, id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/${userId}/one-time-tokens/${id}/revoke`, {});
  }

  revokeAllUserOneTimeTokens(userId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/${userId}/one-time-tokens/revoke-all`, {});
  }

  // User — Passwords
  getUserPasswords(userId: string): Observable<Password[]> {
    return this.http.get<Password[]>(`${this.baseUrl}/users/${userId}/passwords`);
  }

  revokeUserPassword(userId: string, id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/${userId}/passwords/${id}/revoke`, {});
  }

  // User — Refresh Tokens
  getUserRefreshTokens(userId: string): Observable<RefreshToken[]> {
    return this.http.get<RefreshToken[]>(`${this.baseUrl}/users/${userId}/refresh-tokens`);
  }

  revokeUserRefreshToken(userId: string, id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/${userId}/refresh-tokens/${id}/revoke`, {});
  }

  revokeAllUserRefreshTokens(userId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/${userId}/refresh-tokens/revoke-all`, {});
  }

  // User — MFA
  getUserMfa(userId: string): Observable<Mfa> {
    return this.http.get<Mfa>(`${this.baseUrl}/users/${userId}/mfa`);
  }

  deleteUserMfa(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}/mfa`);
  }

  // Settings
  getSettings(): Observable<Setting[]> {
    return this.http.get<Setting[]>(`${this.baseUrl}/settings`);
  }

  getSettingByKey(key: string): Observable<Setting> {
    return this.http.get<Setting>(`${this.baseUrl}/settings/${key}`);
  }

  upsertSetting(input: UpsertSettingInput): Observable<Setting> {
    return this.http.put<Setting>(`${this.baseUrl}/settings`, input);
  }

  deleteSetting(key: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/settings/${key}`);
  }
}

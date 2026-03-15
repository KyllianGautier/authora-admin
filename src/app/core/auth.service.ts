import { Injectable, inject, signal } from '@angular/core';
import { AdminApiService, AdminSignInOutput } from './admin-api.service';
import { Observable, tap } from 'rxjs';

const TOKEN_KEY = 'authora-admin-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly adminApi = inject(AdminApiService);
  readonly isAuthenticated = signal(!!localStorage.getItem(TOKEN_KEY));

  signIn(username: string, password: string): Observable<AdminSignInOutput> {
    return this.adminApi.signIn({ username, password }).pipe(
      tap((result) => {
        localStorage.setItem(TOKEN_KEY, result.accessToken);
        this.isAuthenticated.set(true);
      })
    );
  }

  signOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}

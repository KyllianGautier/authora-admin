import { Routes } from '@angular/router';
import { Users } from './users';
import { UserDetail } from './user-detail/user-detail';
import { UserOneTimeTokens } from './user-detail/user-one-time-tokens/user-one-time-tokens';
import { UserPasswords } from './user-detail/user-passwords/user-passwords';
import { UserRefreshTokens } from './user-detail/user-refresh-tokens/user-refresh-tokens';
import { UserMfaTab } from './user-detail/user-two-factor-auth/user-two-factor-auth';

export const usersRoutes: Routes = [
  {
    path: '',
    component: Users,
    children: [
      {
        path: ':userId',
        component: UserDetail,
        children: [
          { path: '', redirectTo: 'passwords', pathMatch: 'full' },
          { path: 'tokens', component: UserOneTimeTokens },
          { path: 'passwords', component: UserPasswords },
          { path: 'refresh-tokens', component: UserRefreshTokens },
          { path: 'mfa', component: UserMfaTab },
        ],
      },
    ],
  },
];

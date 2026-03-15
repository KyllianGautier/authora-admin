import { Routes } from '@angular/router';
import { Admin } from './admin';

export const adminRoutes: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: '', redirectTo: 'registrations', pathMatch: 'full' },
      {
        path: 'registrations',
        loadChildren: () =>
          import('./registrations/registrations.routes').then((m) => m.registrationsRoutes),
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then((m) => m.usersRoutes),
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.routes').then((m) => m.settingsRoutes),
      },
    ],
  },
];

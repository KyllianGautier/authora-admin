import { Routes } from '@angular/router';
import { langGuard } from './core/lang.guard';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'en', pathMatch: 'full' },
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
      {
        path: 'sign-in',
        loadChildren: () => import('./sign-in/sign-in.routes').then((m) => m.signInRoutes),
      },
      {
        path: '',
        canActivate: [authGuard],
        loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
      },
    ],
  },
];

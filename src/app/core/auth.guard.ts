import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const transloco = inject(TranslocoService);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([`/${transloco.getActiveLang()}/sign-in`]);
};

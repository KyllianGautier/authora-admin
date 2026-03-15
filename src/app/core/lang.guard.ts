import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

export const langGuard: CanActivateFn = (route) => {
  const translocoService = inject(TranslocoService);
  const router = inject(Router);
  const lang = route.params['lang'];
  const availableLangs = translocoService.getAvailableLangs() as string[];

  if (!availableLangs.includes(lang)) {
    return router.createUrlTree([`/${translocoService.getActiveLang()}`]);
  }

  translocoService.setActiveLang(lang);
  return true;
};

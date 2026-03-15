import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-sign-out-button',
  imports: [MatIconButton, MatIcon],
  template: `
    <button mat-icon-button (click)="signOut()">
      <mat-icon>logout</mat-icon>
    </button>
  `,
})
export class SignOutButton {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);

  signOut(): void {
    this.authService.signOut();
    this.router.navigate([`/${this.transloco.getActiveLang()}/sign-in`]);
  }
}

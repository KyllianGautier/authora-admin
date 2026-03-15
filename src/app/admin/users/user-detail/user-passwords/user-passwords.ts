import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { filter, switchMap } from 'rxjs';
import { AdminApiService, Password } from '../../../../core/admin-api.service';
import { ConfirmDialog, ConfirmDialogData } from '../../../../core/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-user-passwords',
  imports: [
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TranslocoDirective,
  ],
  templateUrl: './user-passwords.html',
  styleUrl: './user-passwords.scss',
})
export class UserPasswords implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  private readonly route = inject(ActivatedRoute);

  private userId = '';
  readonly passwords = signal<Password[]>([]);
  readonly loading = signal(true);
  readonly columns = ['revoked', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.userId = this.route.parent!.snapshot.params['userId'];
    this.load();
  }

  revoke(password: Password): void {
    this.confirm('userDetail.confirmRevokePassword')
      .pipe(switchMap(() => this.api.revokeUserPassword(this.userId, password.id)))
      .subscribe(() => {
        this.snackBar.open(this.transloco.translate('userDetail.passwordRevoked'));
        this.load();
      });
  }

  private confirm(messageKey: string) {
    return this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: this.transloco.translate('common.confirmTitle'),
          message: this.transloco.translate(messageKey),
          confirmLabel: this.transloco.translate('userDetail.revoke'),
          cancelLabel: this.transloco.translate('common.cancel'),
        },
      })
      .afterClosed()
      .pipe(filter((result) => result === true));
  }

  private load(): void {
    this.loading.set(true);
    this.api.getUserPasswords(this.userId).subscribe({
      next: (data) => {
        this.passwords.set(data);
        this.loading.set(false);
      },
    });
  }
}

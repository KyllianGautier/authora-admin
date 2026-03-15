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
import { AdminApiService, RefreshToken } from '../../../../core/admin-api.service';
import { ConfirmDialog, ConfirmDialogData } from '../../../../core/components/confirm-dialog/confirm-dialog';
import { TimeUntilPipe } from '../../../../core/pipes/time-until.pipe';

@Component({
  selector: 'app-user-refresh-tokens',
  imports: [
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TranslocoDirective,
    TimeUntilPipe,
  ],
  templateUrl: './user-refresh-tokens.html',
  styleUrl: './user-refresh-tokens.scss',
})
export class UserRefreshTokens implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  private readonly route = inject(ActivatedRoute);

  private userId = '';
  readonly tokens = signal<RefreshToken[]>([]);
  readonly loading = signal(true);
  readonly columns = ['revoked', 'expiredAt', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.userId = this.route.parent!.snapshot.params['userId'];
    this.load();
  }

  revoke(token: RefreshToken): void {
    this.confirm('userDetail.confirmRevokeRefreshToken')
      .pipe(switchMap(() => this.api.revokeUserRefreshToken(this.userId, token.id)))
      .subscribe(() => {
        this.snackBar.open(this.transloco.translate('userDetail.refreshTokenRevoked'));
        this.load();
      });
  }

  revokeAll(): void {
    this.confirm('userDetail.confirmRevokeAllRefreshTokens')
      .pipe(switchMap(() => this.api.revokeAllUserRefreshTokens(this.userId)))
      .subscribe(() => {
        this.snackBar.open(this.transloco.translate('userDetail.allRefreshTokensRevoked'));
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
    this.api.getUserRefreshTokens(this.userId).subscribe({
      next: (data) => {
        this.tokens.set(data);
        this.loading.set(false);
      },
    });
  }
}

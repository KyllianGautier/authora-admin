import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { filter, switchMap } from 'rxjs';
import { AdminApiService, Mfa } from '../../../../core/admin-api.service';
import { ConfirmDialog, ConfirmDialogData } from '../../../../core/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-user-mfa',
  imports: [DatePipe, MatButtonModule, MatProgressSpinnerModule, TranslocoDirective],
  templateUrl: './user-two-factor-auth.html',
  styleUrl: './user-two-factor-auth.scss',
})
export class UserMfaTab implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  private readonly route = inject(ActivatedRoute);

  private userId = '';
  readonly mfa = signal<Mfa | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.userId = this.route.parent!.snapshot.params['userId'];
    this.load();
  }

  remove(): void {
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: this.transloco.translate('common.confirmTitle'),
          message: this.transloco.translate('userDetail.confirmRemoveMfa'),
          confirmLabel: this.transloco.translate('userDetail.removeMfa'),
          cancelLabel: this.transloco.translate('common.cancel'),
        },
      })
      .afterClosed()
      .pipe(
        filter((result) => result === true),
        switchMap(() => this.api.deleteUserMfa(this.userId))
      )
      .subscribe(() => {
        this.snackBar.open(this.transloco.translate('userDetail.mfaRemoved'));
        this.load();
      });
  }

  private load(): void {
    this.loading.set(true);
    this.api.getUserMfa(this.userId).subscribe({
      next: (data) => {
        this.mfa.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.mfa.set(null);
        this.loading.set(false);
      },
    });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { filter, switchMap } from 'rxjs';
import { AdminApiService, Registration } from '../../core/admin-api.service';
import { TimeUntilPipe } from '../../core/pipes/time-until.pipe';
import { ConfirmDialog, ConfirmDialogData } from '../../core/components/confirm-dialog/confirm-dialog';
import { CreateRegistration } from './create-registration/create-registration';

@Component({
  selector: 'app-registrations',
  imports: [
    DatePipe,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslocoDirective,
    TimeUntilPipe,
    MatTooltipModule,
  ],
  templateUrl: './registrations.html',
  styleUrl: './registrations.scss',
})
export class Registrations implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly transloco = inject(TranslocoService);

  readonly displayedColumns = ['select', 'email', 'emailVerificationTokenExpiresAt', 'createdAt', 'actions'];
  readonly registrations = signal<Registration[]>([]);
  readonly loading = signal(true);
  readonly selection = new SelectionModel<Registration>(true, []);

  openCreateDialog(): void {
    this.dialog
      .open(CreateRegistration, { width: '500px' })
      .afterClosed()
      .pipe(filter((result) => result === true))
      .subscribe(() => this.loadRegistrations());
  }

  ngOnInit(): void {
    this.loadRegistrations();
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.registrations().length;
  }

  toggleAll(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.registrations());
    }
  }

  deleteSelected(): void {
    const selected = this.selection.selected;
    this.confirm('registrations.confirmDeleteMany', { count: selected.length })
      .pipe(
        switchMap(() => this.api.deleteManyRegistrations(selected.map((r) => r.id)))
      )
      .subscribe({
        next: () => {
          this.snackBar.open(
            this.transloco.translate('registrations.deleted', { count: selected.length })
          );
          this.selection.clear();
          this.loadRegistrations();
        },
      });
  }

  deleteOne(registration: Registration): void {
    this.confirm('registrations.confirmDeleteOne')
      .pipe(switchMap(() => this.api.deleteRegistration(registration.id)))
      .subscribe({
        next: () => {
          this.snackBar.open(this.transloco.translate('registrations.deleted', { count: 1 }));
          this.selection.deselect(registration);
          this.loadRegistrations();
        },
      });
  }

  private confirm(messageKey: string, params?: Record<string, unknown>) {
    return this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: this.transloco.translate('common.confirmTitle'),
          message: this.transloco.translate(messageKey, params),
          confirmLabel: this.transloco.translate('common.delete'),
          cancelLabel: this.transloco.translate('common.cancel'),
        },
      })
      .afterClosed()
      .pipe(filter((result) => result === true));
  }

  private loadRegistrations(): void {
    this.loading.set(true);
    this.api.getRegistrations().subscribe({
      next: (data) => {
        this.registrations.set(data);
        this.loading.set(false);
      },
    });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { filter, switchMap } from 'rxjs';
import { AdminApiService, User } from '../../core/admin-api.service';
import { ConfirmDialog, ConfirmDialogData } from '../../core/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-users',
  imports: [
    DatePipe,
    RouterOutlet,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslocoDirective,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly displayedColumns = ['select', 'email', 'createdAt', 'actions'];
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly selection = new SelectionModel<User>(true, []);
  readonly selectedUserId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUsers();
    this.route.firstChild?.params.subscribe((params) => {
      this.selectedUserId.set(params['userId'] ?? null);
    });
  }

  selectUser(user: User): void {
    if (this.selectedUserId() === user.id) {
      this.selectedUserId.set(null);
      this.router.navigate(['.'], { relativeTo: this.route });
    } else {
      this.selectedUserId.set(user.id);
      this.router.navigate([user.id], { relativeTo: this.route });
    }
  }

  get hasDetail(): boolean {
    return !!this.route.firstChild;
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.users().length;
  }

  toggleAll(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.users());
    }
  }

  deleteSelected(): void {
    const selected = this.selection.selected;
    this.confirm('users.confirmDeleteMany', { count: selected.length })
      .pipe(switchMap(() => this.api.deleteManyUsers(selected.map((u) => u.id))))
      .subscribe({
        next: () => {
          this.snackBar.open(this.transloco.translate('users.deleted', { count: selected.length }));
          this.selection.clear();
          this.router.navigate(['.'], { relativeTo: this.route });
          this.selectedUserId.set(null);
          this.loadUsers();
        },
      });
  }

  deleteOne(user: User): void {
    this.confirm('users.confirmDeleteOne')
      .pipe(switchMap(() => this.api.deleteUser(user.id)))
      .subscribe({
        next: () => {
          this.snackBar.open(this.transloco.translate('users.deleted', { count: 1 }));
          this.selection.deselect(user);
          if (this.selectedUserId() === user.id) {
            this.selectedUserId.set(null);
            this.router.navigate(['.'], { relativeTo: this.route });
          }
          this.loadUsers();
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

  private loadUsers(): void {
    this.loading.set(true);
    this.api.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
    });
  }
}

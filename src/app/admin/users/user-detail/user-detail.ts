import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoDirective } from '@jsverse/transloco';
import { AdminApiService, User } from '../../../core/admin-api.service';

interface Tab {
  path: string;
  labelKey: string;
}

const TABS: Tab[] = [
  { path: 'passwords', labelKey: 'userDetail.tabs.passwords' },
  { path: 'refresh-tokens', labelKey: 'userDetail.tabs.refreshTokens' },
  { path: 'mfa', labelKey: 'userDetail.tabs.mfa' },
  { path: 'tokens', labelKey: 'userDetail.tabs.oneTimeTokens' },
];

@Component({
  selector: 'app-user-detail',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    TranslocoDirective,
  ],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail {
  private readonly api = inject(AdminApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly tabs = TABS;
  readonly user = signal<User | null>(null);

  constructor() {
    const userId = this.route.snapshot.params['userId'];
    if (userId) {
      this.api.getUserById(userId).subscribe({
        next: (user) => this.user.set(user),
      });
    }
  }

  closePanel(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}

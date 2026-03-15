import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';
import { ThemeToggle } from '../core/components/theme-toggle/theme-toggle';
import { LangSwitcher } from '../core/components/lang-switcher/lang-switcher';
import { SignOutButton } from '../core/components/sign-out-button/sign-out-button';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    TranslocoModule,
    ThemeToggle,
    LangSwitcher,
    SignOutButton,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {}

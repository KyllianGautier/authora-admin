import { Component, Directive } from '@angular/core';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { LangSwitcher } from '../lang-switcher/lang-switcher';

@Directive({ selector: '[authLayoutTitle]' })
export class AuthLayoutTitle {}

@Component({
  selector: 'app-auth-layout',
  imports: [ThemeToggle, LangSwitcher],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {}

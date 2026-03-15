import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { SETTING_CATEGORIES } from './settings-config';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  imports: [
    TranslocoDirective,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  providers: [SettingsService],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private readonly settingsService = inject(SettingsService);

  readonly categories = SETTING_CATEGORIES;
  readonly loading = this.settingsService.loading;
  readonly hasModified = this.settingsService.hasModified;

  ngOnInit(): void {
    this.settingsService.loadSettings();
  }

  resetAll(): void {
    this.settingsService.resetAll();
  }
}

import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SettingRowComponent } from '../setting-row/setting-row';
import { SettingsService, SettingRow } from '../settings.service';
import { SETTING_CATEGORIES } from '../settings-config';

@Component({
  selector: 'app-setting-category',
  imports: [SettingRowComponent],
  templateUrl: './setting-category.html',
  styleUrl: './setting-category.scss',
})
export class SettingCategoryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly settingsService = inject(SettingsService);

  private readonly categoryPath = toSignal(
    this.route.params.pipe(map((params) => params['category'] as string))
  );

  readonly settings = computed<SettingRow[]>(() => {
    const path = this.categoryPath();
    if (!path) return [];
    const category = SETTING_CATEGORIES.find((c) => c.path === path);
    if (!category) return [];
    return this.settingsService.getSettingsForKeys(category.keys);
  });

  openEditDialog(setting: SettingRow): void {
    this.settingsService.openEditDialog(setting);
  }
}

import { computed, inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { forkJoin } from 'rxjs';
import { AdminApiService, Setting } from '../../core/admin-api.service';
import { ConfirmDialog } from '../../core/components/confirm-dialog/confirm-dialog';
import { SETTING_DEFINITIONS, SettingKey, SettingType } from './settings-config';
import { SettingValuePipe } from './setting-value.pipe';
import { EditNumberDialog } from './edit-number-dialog/edit-number-dialog';
import { EditStringDialog } from './edit-string-dialog/edit-string-dialog';
import { EditBooleanDialog } from './edit-boolean-dialog/edit-boolean-dialog';
import { SettingType as ST } from '@kylliangautier/authora-types';
import type { NumberSettingMeta, StringSettingMeta, BooleanSettingMeta } from '@kylliangautier/authora-types';

export interface SettingRow {
  key: SettingKey;
  type: SettingType;
  value: string | number | boolean;
  defaultValue: string | number | boolean;
}

@Injectable()
export class SettingsService {
  private readonly api = inject(AdminApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly transloco = inject(TranslocoService);
  private readonly dialog = inject(MatDialog);
  private readonly settingValuePipe = new SettingValuePipe();

  readonly loading = signal(true);
  readonly settings = signal<SettingRow[]>([]);
  readonly hasModified = computed(() => this.settings().some((s) => s.value !== s.defaultValue));

  loadSettings(): void {
    this.loading.set(true);
    this.api.getSettings().subscribe({
      next: (data: Setting[]) => {
        const rows: SettingRow[] = [];
        for (const item of data) {
          const key = item.key as SettingKey;
          const def = SETTING_DEFINITIONS[key];
          if (def) {
            rows.push({
              key,
              type: def.type,
              value: item.value,
              defaultValue: def.default,
            });
          }
        }
        this.settings.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open(this.transloco.translate('common.error'));
        this.loading.set(false);
      },
    });
  }

  getSettingsForKeys(keys: SettingKey[]): SettingRow[] {
    const keySet = new Set<string>(keys);
    return this.settings().filter((s) => keySet.has(s.key));
  }

  openEditDialog(setting: SettingRow): void {
    const meta = SETTING_DEFINITIONS[setting.key];
    const label = this.transloco.translate('settings.keys.' + setting.key + '.label');
    const dialogConfig = {
      panelClass: 'glass-dialog',
      backdropClass: 'glass-dialog-backdrop',
    };

    switch (setting.type) {
      case ST.DurationSec:
      case ST.DurationMs:
      case ST.Occurrence:
      case ST.ByteSize:
      case ST.Length: {
        const numberMeta = meta as NumberSettingMeta;
        const numberData: Record<string, unknown> = {
          key: setting.key,
          label,
          value: setting.value as number,
          meta: numberMeta,
        };
        if (numberMeta.greaterThan) {
          const ref = this.settings().find((s) => s.key === numberMeta.greaterThan);
          if (ref) {
            numberData['greaterThanValue'] = ref.value;
            numberData['greaterThanLabel'] = this.transloco.translate(
              'settings.keys.' + numberMeta.greaterThan + '.label'
            );
            numberData['greaterThanFormatted'] = this.settingValuePipe.transform(ref.value, ref.type);
          }
        }
        if (numberMeta.lessThan) {
          const ref = this.settings().find((s) => s.key === numberMeta.lessThan);
          if (ref) {
            numberData['lessThanValue'] = ref.value;
            numberData['lessThanLabel'] = this.transloco.translate(
              'settings.keys.' + numberMeta.lessThan + '.label'
            );
            numberData['lessThanFormatted'] = this.settingValuePipe.transform(ref.value, ref.type);
          }
        }
        this.dialog
          .open(EditNumberDialog, {
            ...dialogConfig,
            data: numberData,
          })
          .afterClosed()
          .subscribe((result) => {
            if (result !== undefined) this.saveSetting(setting.key, result);
          });
        break;
      }

      case ST.Url:
      case ST.Pattern:
        this.dialog
          .open(EditStringDialog, {
            ...dialogConfig,
            data: { key: setting.key, label, value: setting.value as string, meta: meta as StringSettingMeta },
          })
          .afterClosed()
          .subscribe((result) => {
            if (result !== undefined) this.saveSetting(setting.key, result);
          });
        break;

      case ST.Toggle:
        this.dialog
          .open(EditBooleanDialog, {
            ...dialogConfig,
            data: { key: setting.key, label, value: setting.value as boolean, meta: meta as BooleanSettingMeta },
          })
          .afterClosed()
          .subscribe((result) => {
            if (result !== undefined) this.saveSetting(setting.key, result);
          });
        break;
    }
  }

  resetAll(): void {
    const t = this.transloco;
    this.dialog
      .open(ConfirmDialog, {
        panelClass: 'glass-dialog',
        backdropClass: 'glass-dialog-backdrop',
        data: {
          title: t.translate('common.confirmTitle'),
          message: t.translate('settings.resetAllConfirm'),
          confirmLabel: t.translate('settings.resetAll'),
          cancelLabel: t.translate('common.cancel'),
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        const modified = this.settings().filter((s) => s.value !== s.defaultValue);
        if (modified.length === 0) return;
        forkJoin(modified.map((s) => this.api.deleteSetting(s.key))).subscribe({
          next: () => {
            this.snackBar.open(t.translate('settings.resetAllDone'));
            this.settings.update((rows) =>
              rows.map((row) => ({ ...row, value: row.defaultValue }))
            );
          },
          error: () => {
            this.snackBar.open(t.translate('common.error'));
          },
        });
      });
  }

  private saveSetting(key: SettingKey, value: string | number | boolean): void {
    this.api.upsertSetting({ key, value }).subscribe({
      next: () => {
        this.snackBar.open(this.transloco.translate('settings.saved'));
        this.settings.update((rows) =>
          rows.map((row) => (row.key === key ? { ...row, value } : row))
        );
      },
      error: () => {
        this.snackBar.open(this.transloco.translate('common.error'));
      },
    });
  }
}

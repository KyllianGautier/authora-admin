import { Component, computed, input, output } from '@angular/core';
import { SettingKey, SettingType } from '@kylliangautier/authora-types';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { SettingValuePipe } from '../setting-value.pipe';
import { MatRippleModule } from '@angular/material/core';

const ICON_MAP: Record<SettingType, string> = {
  [SettingType.DurationSec]: 'schedule',
  [SettingType.DurationMs]: 'timer',
  [SettingType.Occurrence]: 'repeat',
  [SettingType.ByteSize]: 'memory',
  [SettingType.Length]: 'straighten',
  [SettingType.Url]: 'link',
  [SettingType.Pattern]: 'code',
  [SettingType.Toggle]: 'toggle_on',
};

@Component({
  selector: 'app-setting-row',
  imports: [TranslocoDirective, SettingValuePipe, MatRippleModule, MatIcon],
  templateUrl: './setting-row.html',
  styleUrl: './setting-row.scss',
})
export class SettingRowComponent {
  readonly key = input.required<SettingKey>();
  readonly type = input.required<SettingType>();
  readonly value = input.required<string | number | boolean>();
  readonly defaultValue = input.required<string | number | boolean>();

  readonly edit = output<void>();

  readonly isModified = computed(() => this.value() !== this.defaultValue());
  readonly icon = computed(() => ICON_MAP[this.type()] ?? 'settings');
}

import { inject, Pipe, PipeTransform } from '@angular/core';
import { SettingType } from '@kylliangautier/authora-types';
import { TranslocoService } from '@jsverse/transloco';
import { DurationPipe } from '../../core/pipes/duration.pipe';
import { DurationMsPipe } from '../../core/pipes/duration-ms.pipe';
import { ByteSizePipe } from '../../core/pipes/byte-size.pipe';
import { OccurrencePipe } from '../../core/pipes/occurrence.pipe';
import { CharLengthPipe } from '../../core/pipes/length.pipe';

@Pipe({ name: 'settingValue' })
export class SettingValuePipe implements PipeTransform {
  private readonly transloco = inject(TranslocoService);
  private readonly duration = new DurationPipe();
  private readonly durationMs = new DurationMsPipe();
  private readonly byteSize = new ByteSizePipe();
  private readonly occurrence = new OccurrencePipe();
  private readonly charLength = new CharLengthPipe();

  transform(value: string | number | boolean, type: SettingType): string {
    switch (type) {
      case SettingType.DurationSec:
        return this.duration.transform(value as number);
      case SettingType.DurationMs:
        return this.durationMs.transform(value as number);
      case SettingType.Occurrence:
        return this.occurrence.transform(value as number);
      case SettingType.ByteSize:
        return this.byteSize.transform(value as number);
      case SettingType.Length:
        return this.charLength.transform(value as number);
      case SettingType.Toggle: {
        const enabled = value === true || value === 'true';
        return this.transloco.translate(enabled ? 'settings.enabled' : 'settings.disabled');
      }
      default:
        return String(value);
    }
  }
}

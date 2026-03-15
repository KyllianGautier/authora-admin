import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'durationMs' })
export class DurationMsPipe implements PipeTransform {
  transform(ms: number | string): string {
    const val = Number(ms);
    if (isNaN(val) || val < 0) return '—';

    if (val < 1000) return `${val}ms`;

    const s = Math.floor(val / 1000);
    const remaining = val % 1000;

    if (remaining > 0) return `${s}s ${remaining}ms`;
    return `${s}s`;
  }
}

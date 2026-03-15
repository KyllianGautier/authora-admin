import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'byteSize' })
export class ByteSizePipe implements PipeTransform {
  transform(kib: number | string): string {
    const val = Number(kib);
    if (isNaN(val) || val < 0) return '—';
    if (val < 1024) return `${val} KiB`;
    if (val < 1048576) return `${(val / 1024).toFixed(1)} MiB`;
    return `${(val / 1048576).toFixed(1)} GiB`;
  }
}

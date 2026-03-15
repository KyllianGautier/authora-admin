import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'occurrence' })
export class OccurrencePipe implements PipeTransform {
  transform(value: number | string): string {
    const num = Number(value);
    if (isNaN(num)) return '—';
    return `${num}×`;
  }
}

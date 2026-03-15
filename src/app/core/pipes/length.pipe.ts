import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'charLength' })
export class CharLengthPipe implements PipeTransform {
  transform(value: number | string): string {
    const num = Number(value);
    if (isNaN(num)) return '—';
    return `${num} chars`;
  }
}

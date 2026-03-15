import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeUntil' })
export class TimeUntilPipe implements PipeTransform {
  transform(value: string | Date): string {
    const target = new Date(value).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      return 'Expired';
    }

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return `${seconds}s`;
  }
}

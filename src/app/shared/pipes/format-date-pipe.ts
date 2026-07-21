import { inject, Pipe, PipeTransform } from '@angular/core';
import { UserStore } from '@core/data/user-store.data';
import { formatDate } from '@core/helpers/date-format.helper';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  private userStore = inject(UserStore);

  transform(date: string, monthLength?: "numeric" | "2-digit" | "long" | "short" | "narrow"): string {
    return formatDate(date, this.userStore.settings()?.locale, monthLength)
  }

}

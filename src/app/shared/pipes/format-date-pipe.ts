import { inject, Pipe, PipeTransform } from '@angular/core';
import { UserStore } from '@core/data/user-store.data';
import { formatDate } from '@core/helpers/date-format.helper';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  private userStore = inject(UserStore);

  transform(date: string): string {
    return formatDate(date, this.userStore.settings()?.locale)
  }

}

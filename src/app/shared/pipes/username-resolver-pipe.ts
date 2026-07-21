import { inject, Pipe, PipeTransform } from '@angular/core';
import { UserStore } from '@core/data/user-store.data';

@Pipe({
  name: 'usernameResolver'
})
export class UsernameResolverPipe implements PipeTransform {
  private userStore = inject(UserStore);
  transform(email: string): string {

    const user = this.userStore.user()!;
    const splitedAuthUser = user.email.split('@')[0];
    const splitedRegisterEmail = email.split('@')[0];

    const additionalPronoun = splitedRegisterEmail === splitedAuthUser ? ' (Eu)' : '';
    return email + additionalPronoun;
  }

}

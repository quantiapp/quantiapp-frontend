import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationPartial } from '@core/partials/client/secure/navigation.partial';
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-master',
  imports: [RouterOutlet, NavigationPartial, Darkable],
  template: `
    <div class="master relative bg-[#F2F4F5] min-h-[100dvh]" appDarkable="dark:bg-(color:--secondary)/85">
      <div class="master-container">
        <router-outlet></router-outlet>
      </div>
      <div class="menu sticky bottom-0 z-[101]">
        <app-navigation />
      </div>
    </div>
  `,
  styles: ``
})
export class MasterLayout {

}

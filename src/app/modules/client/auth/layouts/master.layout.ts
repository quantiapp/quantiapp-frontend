import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MotionedHeight } from "@shared/directives/motioned-height";
import { Darkable } from "@shared/directives/darkable";

@Component({
  selector: 'app-master',
  imports: [RouterOutlet, MotionedHeight, RouterLink, Darkable],
  template: `
    <div class="master bg-white h-[100dvh]" appDarkable="dark:bg-(color:--dm-bg)">
      <div class="panel-container h-full flex flex-col gap-5 justify-center">
        <div
        data-aos="zoom-in-down"
        class="container-header flex flex-col gap-[0.625rem] justify-center items-center">
          <div class="logo w-[3.438rem] h-[3.438rem] rounded-full border border-(color:--primary)">
            <a routerLink="/">
              <img src="/static/primary-brand.svg" class="w-full h-full" alt="Quantiapp logo">
            </a>
          </div>
          <span class="app-name font-bold text-xl text-(color:--secondary)" appDarkable="dark:text-(color:--dm-secondary)">QuantiAPP</span>
        </div>
        <div
        class="container-content flex flex-col" appMotionedHeight [RouterOutletable]="true">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class MasterLayout {

}

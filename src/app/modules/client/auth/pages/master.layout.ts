import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MotionedHeight } from "@shared/directives/motioned-height";

@Component({
  selector: 'app-master',
  imports: [RouterOutlet, MotionedHeight, RouterLink],
  template: `
    <div class="master bg-white dark:bg-(color:--dm-bg) dm-bg-color-transition h-[100dvh]">
      <div class="panel-container h-full flex flex-col gap-5 justify-center">
        <div
        data-aos="zoom-in-down"
        class="container-header flex flex-col gap-[10px] justify-center items-center">
          <div class="logo w-[55px] h-[55px] rounded-full border border-(color:--primary)">
            <a routerLink="/">
              <img src="/static/primary-brand.svg" class="w-full h-full" alt="Quantiapp logo">
            </a>
          </div>
          <span class="app-name font-bold text-xl text-(color:--secondary) dark:text-(color:--dm-secondary) dm-text-color-transition">QuantiAPP</span>
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

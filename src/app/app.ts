import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from "aos";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('quantiapp');
  private platformId = inject(PLATFORM_ID);

  constructor(
    // @Inject(PLATFORM_ID) private platformId: any
  ) {
    if(!isPlatformBrowser(this.platformId)) return;
    AOS.init({
      offset: 200,
      duration: 900,
      easing: 'ease-in-out-cubic',
      delay: 0,
      once: true
    });

    setTimeout(() => {
      window.scrollBy(0, 1);
      window.scrollBy(0, -1);
    }, 100);
  }

}

import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import * as AOS from "aos";
import { LoadingDataUi } from "@client/secure/ui/loading-data.ui";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingDataUi],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('quantiapp');
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  isResolving = computed(() => !!this.router.currentNavigation());

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

  ngOnInit(): void {
    
  }

}

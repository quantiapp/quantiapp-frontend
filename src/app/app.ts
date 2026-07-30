import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import * as AOS from "aos";
import { LoadingDataUi } from "@client/secure/ui/loading-data.ui";
import { PopupUi } from "@shared/ui/popup/popup.ui";
import { ThemeService } from '@core/services/theme.service';
import { SupabaseService } from '@core/services/supabase.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { ConnectionService } from '@core/services/connection.service';
import { SubmitableButton } from '@shared/directives/submitable-button';
import { OfflineSyncService } from '@core/services/offline-sync.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingDataUi, PopupUi, SubmitableButton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('quantiapp');
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private supabaseService = inject(SupabaseService);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private connectionService = inject(ConnectionService);
  private offlineSyncService = inject(OfflineSyncService);

  isOffline = this.connectionService.isOffline;
  hasOfflineSupport = this.connectionService.hasOfflineSupport;

  svgSprites = signal<SafeHtml>('');

  goToProfile(): void {
    this.router.navigate(['/secure/profile']);
  }

  isResolving = computed(() => {
    const nav = this.router.currentNavigation();
    if (!nav) return false;

    const targetUrl = nav.extractedUrl?.toString() || '';
    const isAuthRoute = targetUrl.includes('/auth');
    const isSecureRoute = targetUrl.includes('/secure') || this.router.url.includes('/secure');

    // Exibe o carregamento de dados apenas ao navegar nas áreas privadas /secure com sessão ativa
    return !isAuthRoute && isSecureRoute && !!this.supabaseService.session();
  });

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

  private themeService = inject(ThemeService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.themeService.initTheme();
      this.loadSprites();
    }
  }

  loadSprites(): void {
    this.http.get(`${environment.server}/api/sprites.svg`, { responseType: 'text' })
      .subscribe({
        next: (svg) => {
          this.svgSprites.set(this.sanitizer.bypassSecurityTrustHtml(svg));
        },
        error: (err) => {
          console.error('Falha ao carregar os ícones dinâmicos do backend:', err);
        }
      });
  }
}

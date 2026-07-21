import { Directive, inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class RouterService {
    private router = inject(Router);
    routeToSecureIndex(uri?: string) {
        this.router.navigate([`/secure/${ uri ?? '' }`])
    }

    routeTo(commands: any[]) {
        this.router.navigate(commands);
    }
}
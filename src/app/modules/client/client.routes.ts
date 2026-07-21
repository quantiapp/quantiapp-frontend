import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth.guard";
import { guestGuard } from "@core/guards/guest.guard";

export const clientRoutes: Routes = [
    {
        path: '',
        redirectTo: '/auth/sign-in',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        canActivate: [guestGuard],
        loadComponent:() => import('./auth/layouts/master.layout').then(layout => layout.MasterLayout),
        loadChildren: () => import('./auth/client.auth.routes').then(routes => routes.clientAuthRoutes)
    },
    {
        path: 'secure',
        canActivate: [authGuard],
        loadComponent:() => import('./secure/layouts/master.layout').then(layout => layout.MasterLayout),
        loadChildren: () => import('./secure/client.secure.routes').then(routes => routes.clientSecureRoutes)
    }
];
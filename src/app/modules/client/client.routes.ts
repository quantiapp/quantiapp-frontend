import { Routes } from "@angular/router";

export const clientRoutes: Routes = [
    {
        path: '',
        redirectTo: '/auth/sign-in',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadComponent:() => import('./auth/pages/master.layout').then(layout => layout.MasterLayout),
        loadChildren: () => import('./auth/client.auth.routes').then(routes => routes.clientAuthRoutes)
    },
    {
        path: 'account',
        loadChildren: () => import('./secure/client.secure.routes').then(routes => routes.clientSecureRoutes)
    }
];
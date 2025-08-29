import { Routes } from '@angular/router';

export const routes: Routes = [
    // web module routes
    {
        path: '',
        // loadChildren: () => import('./modules/web/web.routes').then(routes => routes.webRoutes)
        redirectTo: '/auth/sign-in',
        pathMatch: 'full'
    },
    // client
    {
        path: '',
        loadChildren: () => import('./modules/client/client.routes').then(routes => routes.clientRoutes)
    },
    // {
    //     path: 'admin',
    //     loadChildren: () => import('./modules/admin/admin.routes').then(routes => routes.)
    // }
];

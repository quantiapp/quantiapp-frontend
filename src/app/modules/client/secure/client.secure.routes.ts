import { Routes } from "@angular/router";

export const clientSecureRoutes: Routes = [
    {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.page').then(page => page.DashboardPage),
    },
];
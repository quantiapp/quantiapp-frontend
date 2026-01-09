import { Routes } from "@angular/router";

export const clientSecureRoutes: Routes = [
    {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.page').then(page => page.DashboardPage),
    },
    {
        path: 'accounts',
        title: 'Minhas contas',
        loadComponent: () => import('./features/accounts/account.page').then(page => page.AccountPage)
    }
];
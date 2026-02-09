import { Routes } from "@angular/router";
import { dashboardResolver } from "./features/dashboard/resolvers/dashboard-resolver";
import { dashboardProviders } from "./features/dashboard/providers";
import { accountResolver } from "./features/accounts/resolvers/account-resolver";
import { accountProviders } from "./features/accounts/provider";

export const clientSecureRoutes: Routes = [
    {
        path: 'dashboard',
        title: 'Dashboard',
        resolve: { data: dashboardResolver },
        providers: dashboardProviders(),
        loadComponent: () => import('./features/dashboard/dashboard.page').then(page => page.DashboardPage),
    },
    {
        path: 'accounts',
        title: 'Minhas contas',
        resolve: { data: accountResolver },
        providers: accountProviders(),
        loadComponent: () => import('./features/accounts/account.page').then(page => page.AccountPage)
    }
];
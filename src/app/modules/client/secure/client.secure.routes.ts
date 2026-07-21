import { Routes } from "@angular/router";
import { dashboardResolver } from "./features/dashboard/resolvers/dashboard-resolver";
import { dashboardProviders } from "./features/dashboard/providers";
import { accountResolver } from "./features/accounts/resolvers/account-resolver";
import { accountProviders } from "./features/accounts/provider";
import { goalResolver } from "./features/goals/resolvers/goal-details-resolver";
import { goalProviders } from "./features/goals/provider";
import { transactionResolver } from "./features/transactions/resolvers/transaction-resolver";
import { transactionProviders } from "./features/transactions/providers";
import { profileResolver } from "./features/profile/resolvers/profile-resolver";
import { profileProviders } from "./features/profile/provider";
import { settingsResolver } from "./features/settings/resolvers/settings-resolver";
import { settingsProviders } from "./features/settings/provider";
import { onboardingGuard } from "@core/guards/onboarding.guard";

export const clientSecureRoutes: Routes = [
    {
        path: '',
        redirectTo: '/secure/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'onboarding',
        title: 'Configuração Inicial',
        canActivate: [onboardingGuard],
        providers: settingsProviders(),
        loadComponent: () => import('./features/onboarding/onboarding.page').then(page => page.OnboardingPage),
    },
    {
        path: 'dashboard',
        title: 'Dashboard',
        canActivate: [onboardingGuard],
        resolve: { data: dashboardResolver },
        providers: dashboardProviders(),
        loadComponent: () => import('./features/dashboard/dashboard.page').then(page => page.DashboardPage),
    },
    {
        path: 'accounts',
        canActivate: [onboardingGuard],
        children: [
            {
                path: '',
                title: 'Minhas contas',
                resolve: { data: accountResolver },
                providers: accountProviders(),
                loadComponent: () => import('./features/accounts/account.page').then(page => page.AccountPage)
            },
            {
                path: 'show/:id',
                resolve: { data: accountResolver },
                providers: accountProviders(),
                loadComponent: () => import('./features/accounts/account-details/details.page').then(page => page.DetailsPage),
                children: [
                    {
                        path: '',
                        redirectTo: 'finance',
                        pathMatch: 'full'
                    },
                    {
                        path: 'finance',
                        title: 'Detalhes de conta',
                        loadComponent: () => import('./features/accounts/account-details/components/finances/finances.component').then(comp => comp.FinancesComponent)
                    },
                    {
                        path: 'sharing-permissions',
                        title: 'Permissões de acesso à conta',
                        loadComponent: () => import('./features/accounts/account-details/components/sharing-permissions/sharing-permissions.component').then(comp => comp.SharingPermissionsComponent)
                    }
                ]
            }
        ]
    },
    {
        path: ':account/goals',
        canActivate: [onboardingGuard],
        children: [
            {
                path: 'show/:id',
                title: 'Detalhes de meta',
                resolve: { data: goalResolver },
                providers: goalProviders(),
                loadComponent: () => import('./features/goals/goal-details/goal-details.page').then(page => page.GoalDetailsPage)
            }
        ]
    },
    {
        path: 'transactions',
        title: 'Minhas transações',
        canActivate: [onboardingGuard],
        resolve: {
            data: transactionResolver
        },
        providers: transactionProviders(),
        loadComponent: () => import('./features/transactions/transaction.page').then(page => page.TransactionPage)
    },
    {
        path: 'profile',
        title: 'Perfil',
        canActivate: [onboardingGuard],
        resolve: { data: profileResolver },
        providers: profileProviders(),
        loadComponent: () => import('./features/profile/profile.page').then(page => page.ProfilePage)
    },
    {
        path: 'settings',
        title: 'Definições Gerais',
        canActivate: [onboardingGuard],
        resolve: { data: settingsResolver },
        providers: settingsProviders(),
        loadComponent: () => import('./features/settings/settings.page').then(page => page.SettingsPage)
    }
];
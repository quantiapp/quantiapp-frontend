import { Routes } from "@angular/router";
import { recoveryGuard } from "@core/guards/recovery.guard";

export const clientAuthRoutes: Routes = [
    {
        path: 'sign-in',
        title: 'Entrar na minha conta',
        loadComponent: () => import('./features/sign-in/sign-in.page').then(page => page.SignInPage)
    },
    {
        path: 'sign-up',
        title: 'Criar a minha conta',
        loadComponent: () => import('./features/sign-up/sign-up.page').then(page => page.SignUpPage)
    },
    {
        path: 'forgot-password',
        title: 'Esqueci a minha senha',
        loadComponent: () => import('./features/request-password-recovery/request-password-reset.page').then(page => page.RequestPasswordResetPage)
    },
    {
        path: 'reset-password',
        title: 'Redefinir a minha senha',
        canActivate: [recoveryGuard],
        loadComponent: () => import('./features/reset-password/reset-password.page').then(page => page.ResetPasswordPage)
    }
];
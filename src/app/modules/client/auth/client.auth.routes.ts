import { Routes } from "@angular/router";

export const clientAuthRoutes: Routes = [
    {
        path: 'sign-in',
        title: 'Entrar na minha conta',
        loadComponent: () => import('./pages/sign-in.page').then(page => page.SignInPage)
    },
    {
        path: 'sign-up',
        title: 'Criar a minha conta',
        loadComponent: () => import('./pages/sign-up.page').then(page => page.SignUpPage)
    },
    {
        path: 'forgot-password',
        title: 'Esqueci a minha senha',
        loadComponent: () => import('./pages/request-password-reset.page').then(page => page.RequestPasswordResetPage)
    },
    {
        path: 'reset-password',
        title: 'Redifinir a minha senha',
        canActivate: [],
        loadComponent: () => import('./pages/reset-password.page').then(page => page.ResetPasswordPage)
    }
];
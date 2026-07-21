export interface UserSetting {
    language: string;
    locale: string;
    theme: string;
    offline_mode: boolean;
    userToken?: string;
    sharingKey: string;
    currency_id: string;
}
export interface PlanLimits {
    plan_name: 'free' | 'pro' | 'unlimited' | string;
    max_accounts: number;          // -1 for unlimited
    max_goals_per_account: number; // -1 for unlimited
    max_shares: number;            // -1 for unlimited
    has_offline_mode?: boolean;
}

export interface User {
    id: string,
    name: string,
    email: string,
    username: string,
    token?: string,
    avatar?: string,
    plan_limits?: PlanLimits
}
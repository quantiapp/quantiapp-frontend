export interface CreateGoalContract {
    name: string;
    description: string;
    current_amount: number;
    target_amount: number;
    track_progress: boolean;
    icon_key: string;
    account_id: string;
}

export interface UpdateGoalContract {
    name?: string;
    description?: string;
    current_amount?: number;
    target_amount?: number;
    track_progress?: boolean;
    icon_key?: string;
    account_id?: string;
}

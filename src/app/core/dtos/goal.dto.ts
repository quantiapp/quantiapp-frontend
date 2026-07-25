import { CreateGoalContract, UpdateGoalContract } from "@core/contracts/goal.contracts";
import { BaseGoal } from "@core/models/base-goal.model";

export class CreateGoalDTO {
    private name: string;
    private description: string;
    private current_amount: number;
    private target_amount: number;
    private track_progress: boolean;
    private icon_key: string;
    private account_id: string;

    public constructor(
        name: string,
        description: string,
        current_amount: number,
        target_amount: number,
        track_progress: boolean,
        icon_key: string,
        account_id: string
    ) {
        this.name = name;
        this.description = description;
        this.current_amount = Number(current_amount ?? 0);
        this.target_amount = Number(target_amount ?? 0);
        this.track_progress = track_progress;
        this.icon_key = icon_key;
        this.account_id = account_id;
    }

    public get contract(): CreateGoalContract {
        return {
            name: this.name,
            description: this.description,
            current_amount: this.current_amount,
            target_amount: this.target_amount,
            track_progress: this.track_progress,
            icon_key: this.icon_key,
            account_id: this.account_id
        };
    }
}

export class UpdateGoalDTO {
    private name?: string;
    private description?: string;
    private current_amount?: number;
    private target_amount?: number;
    private track_progress?: boolean;
    private icon_key?: string;
    private account_id?: string;

    public constructor(data: Partial<BaseGoal>) {
        this.name = data.name;
        this.description = data.description;
        this.current_amount = data.current_amount;
        this.target_amount = data.target_amount;
        this.track_progress = data.track_progress;
        this.icon_key = data.icon_key;
        this.account_id = data.account_id;
    }

    public get contract(): UpdateGoalContract {
        const c: UpdateGoalContract = {};
        if (this.name !== undefined) c.name = this.name;
        if (this.description !== undefined) c.description = this.description;
        if (this.current_amount !== undefined) c.current_amount = this.current_amount;
        if (this.target_amount !== undefined) c.target_amount = this.target_amount;
        if (this.track_progress !== undefined) c.track_progress = this.track_progress;
        if (this.icon_key !== undefined) c.icon_key = this.icon_key;
        if (this.account_id !== undefined) c.account_id = this.account_id;
        return c;
    }
}

import { ActionProviders } from "@core/base/action-providers";
import { GoalFacade } from "../goal.facade";
import { GoalDetailsFacade } from "./goal-details.facade";

export function goalDetailsProviders(): any[] {
    return [
        ...ActionProviders(),
        GoalFacade,
        GoalDetailsFacade
    ];
}
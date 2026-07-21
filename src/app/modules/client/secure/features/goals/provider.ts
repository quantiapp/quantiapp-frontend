import { ActionProviders } from "@core/base/action-providers";
import { GoalFacade } from "./goal.facade";

export function goalProviders(): any[] {
    return [
        ...ActionProviders(),
        GoalFacade
    ];
}
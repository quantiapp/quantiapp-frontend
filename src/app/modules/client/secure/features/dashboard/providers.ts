import { ActionProviders } from "@core/base/action-providers";
import { DashboardFacade } from "./dashboard.facade";

export function dashboardProviders() {
    return [
        ...ActionProviders(),
        DashboardFacade,
    ];
}
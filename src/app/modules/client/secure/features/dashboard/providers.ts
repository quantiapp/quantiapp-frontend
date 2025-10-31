import { DashboardFacade } from "./dashboard.facade";
import { DashboardService } from "./dashboard.service";
import { DashboardSimulator } from "./simulator.service";

export function dashboardProviders() {
    return [
        DashboardSimulator,
        DashboardService,
        DashboardFacade
    ];
}
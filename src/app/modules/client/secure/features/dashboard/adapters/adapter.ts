import { IAdapter } from "@core/interfaces/adapter.interface";
import { DashboardSnapshot } from "../models";

export class DahshboardAdapter implements IAdapter<any, DashboardSnapshot> {
    fromApi(raw: any): DashboardSnapshot {
        return {
            accounts: raw.accounts,
            summary: raw.summary
        }
    }
}
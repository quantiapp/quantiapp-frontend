import { ActionProviders } from "@core/base/action-providers";
import { DetailsFacade } from "./details.facade";
import { AccountFacade } from "../account.facade";

export function accountDetailsProviders(): any[] {
    return [
        ...ActionProviders(),
        AccountFacade,
        DetailsFacade,
    ];
}
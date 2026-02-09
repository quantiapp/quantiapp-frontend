import { ActionProviders } from "@core/base/action-providers";
import { AccountFacade } from "./account.facade";

export function accountProviders(): any[]{
    return [
        ...ActionProviders(),
        AccountFacade
    ]
}
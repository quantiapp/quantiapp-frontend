import { ActionProviders } from "@core/base/action-providers";
import { TransactionFacade } from "./transaction.facade";

export function transactionProviders(): any[] {
    return [
        ...ActionProviders(),
        TransactionFacade
    ];
}
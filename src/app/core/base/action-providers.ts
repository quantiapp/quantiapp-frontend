import { AccountService } from "@client/secure/features/accounts/account.service";
import { GoalService } from "@client/secure/features/goals/goal.service";
import { TransactionService } from "@client/secure/features/transactions/transaction.service";

export function ActionProviders() {
    return [
        AccountService,
        GoalService,
        TransactionService
    ];
}
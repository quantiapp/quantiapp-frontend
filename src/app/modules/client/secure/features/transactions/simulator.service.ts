import { Injectable } from "@angular/core";
import { Mockery } from "@core/abstracts/mock.abstract";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { delay, Observable, of } from "rxjs";
import { TransactionCursor, TransactionMonthGroup, TransactionDataContract } from "./models";

@Injectable({
    providedIn: 'root'
})
export class TransactionSimulator extends Mockery {

    latest(): Observable<BaseTransaction[]> {
        return this.convertToObservable(this.MOCK_TRANSACTIONS)
    }

    transactionsByAccount(accountId: string): Observable<BaseTransaction[]> {
        const transactions = this.MOCK_TRANSACTIONS_MERGE.filter(tx => {
            const originGoal = this.MOCK_GOALS_MERGED.find(goal => goal.id === tx.source?.id);
            const destinationGoal = this.MOCK_GOALS_MERGED.find(goal => goal.id === tx.destination?.id);

            return (originGoal?.account_id === accountId || destinationGoal?.account_id === accountId);
        })
        return this.convertToObservable(transactions);
    }

    transactionsByGoal(goalId: string): Observable<BaseTransaction[]> {
        const transactions = this.MOCK_TRANSACTIONS_MERGE.filter(tx => {
            const originGoal = this.MOCK_GOALS_MERGED.find(goal => goal.id === tx.source?.id);
            const destinationGoal = this.MOCK_GOALS_MERGED.find(goal => goal.id === tx.destination?.id);

            return (originGoal?.id === goalId || destinationGoal?.id === goalId);
        });
        return this.convertToObservable(transactions)
    }

    transactionsByFilter(filter: any): Observable<BaseTransaction[]> {
        return this.convertToObservable(this.MOCK_TRANSACTIONS_EXTENDED);
    }

    last(cursor?: TransactionCursor | null, filters?: any): Observable<TransactionDataContract> {
        const sanitizeId = (id: string | undefined | null) => {
            if (!id) return '';
            return id.replace(/'/g, "");
        };

        const sortedTransactions = [...this.MOCK_TRANSACTIONS_EXTENDED].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (dateA !== dateB) {
                return dateB - dateA;
            }
            return b.id.localeCompare(a.id);
        });

        let filtered = sortedTransactions;

        if (filters) {
            if (filters.type && filters.type !== 'all') {
                filtered = filtered.filter(tx => tx.type === filters.type);
            }
            if (filters.account) {
                filtered = filtered.filter(tx => {
                    const originGoal = this.MOCK_GOALS_MERGED.find(goal => sanitizeId(goal.id) === sanitizeId(tx.source?.id));
                    const destinationGoal = this.MOCK_GOALS_MERGED.find(goal => sanitizeId(goal.id) === sanitizeId(tx.destination?.id));
                    return (originGoal?.account_id === filters.account || destinationGoal?.account_id === filters.account);
                });
            }
            if (filters.origin) {
                filtered = filtered.filter(tx => sanitizeId(tx.source?.id) === sanitizeId(filters.origin));
            }
            if (filters.destination) {
                filtered = filtered.filter(tx => sanitizeId(tx.destination?.id) === sanitizeId(filters.destination));
            }
            if (filters.period) {
                const now = new Date();
                filtered = filtered.filter(tx => {
                    const txDate = new Date(tx.date);
                    const diffTime = Math.abs(now.getTime() - txDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (filters.period === 'last-7-days') {
                        return diffDays <= 7;
                    } else if (filters.period === 'this-month') {
                        return txDate.getFullYear() === now.getFullYear() && txDate.getMonth() === now.getMonth();
                    } else if (filters.period === 'last-3 months') {
                        return diffDays <= 90;
                    }
                    return true;
                });
            }
        }

        let startIndex = 0;
        if (cursor && cursor.id) {
            const index = filtered.findIndex(tx => tx.id === cursor.id);
            if (index !== -1) {
                startIndex = index + 1;
            }
        }

        const pageTransactions = filtered.slice(startIndex, startIndex + 20);

        const monthGroupsMap: Record<string, { month: { label: string; key: string }; transactions: BaseTransaction[] }> = {};
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        pageTransactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthLabel = `${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthGroupsMap[monthKey]) {
                monthGroupsMap[monthKey] = {
                    month: {
                        label: monthLabel,
                        key: monthKey
                    },
                    transactions: []
                };
            }
            monthGroupsMap[monthKey].transactions.push(tx);
        });

        const dataGroups: TransactionMonthGroup[] = Object.keys(monthGroupsMap)
            .sort((a, b) => b.localeCompare(a))
            .map(key => monthGroupsMap[key]);

        let nextCursor: TransactionCursor | null = null;
        if (pageTransactions.length === 20 && startIndex + 20 < filtered.length) {
            const lastTx = pageTransactions[pageTransactions.length - 1];
            nextCursor = {
                date: lastTx.date,
                id: lastTx.id
            };
        }

        const response: TransactionDataContract = {
            data: dataGroups,
            next_cursor: nextCursor
        };

        return of(response).pipe(delay(1000));
    }

    private convertToObservable(data: any): Observable<any> {
        return of(data).pipe(delay(2000));
    }
}
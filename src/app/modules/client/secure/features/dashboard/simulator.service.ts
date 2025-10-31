import { IDataSimulator } from "@core/interfaces/data-simulator.interface";
import { DashboardAccount, DashboardGoal, DashboardSnapshot, DashboardTransaction } from "./models";
import { delay, map, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { DashboardService } from "./dashboard.service";

@Injectable({
    providedIn: DashboardService
})
export class DashboardSimulator implements IDataSimulator<DashboardSnapshot> {
    
    data(): Observable<any> {
        const data: Object = {
            accounts: this.accounts,
            summary: {
                total_balance: 345343459.90,
                exchanges: {
                    user_currency: {
                        code: 'AOA'
                    },
                    conversions: [
                        {
                            from: "EUR",
                            value: 870.96
                        },
                        {
                            from: "USD",
                            value: 750.00
                        },
                        {
                            from: "BRL",
                            value: 590.05
                        }
                    ]
                }
            }
        };
        return of(data).pipe(delay(2000));
    }

    goalsByAccount(account_id: string): Observable<DashboardGoal[]> {
        return of(this.goals.filter(item => item.account.id === account_id)).pipe(delay(1000));
    }

    transactionsByGoal(goal_id: string): Observable<DashboardTransaction[]> {
        return of(this.goals.find(item => item.id === goal_id)).pipe(
            map(goal => goal?.latest_transactions ?? [])
        );
    }

    private accounts: DashboardAccount[] = [
        {
            id: 'acc-bai',
            name: 'Banco Bai',
            type: {
                id: 'tid',
                description: 'Conta corrente',
                icon: {
                    id: 6,
                    reference: 'dolar',
                    display: 'dolar',
                    embedded_svg: '<svg></svg>'
                }
            },
            goals: [
                {
                    id: 'gid-bai',
                    name: 'Comprar Televisor',
                    description: 'Poupar para comprar um novo televisor Smart 4K.',
                    amount: 1250000.00,
                    achievement: 2500000.00,
                    excess_amount: 0,
                    progress: 50,
                    icon: {
                        id: 1,
                        reference: 'tv',
                        display: 'television',
                        embedded_svg: `
                        <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 2H15V10H2V2ZM1 11H16V12H1V11ZM7 13H10V14H7V13Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>`
                    },
                    account: {
                        id: 'acc-bai',
                        name: 'Banco BAI',
                        settings: {
                            color: '#002D74',
                            currency: {
                                name: 'Angolan Kwanza',
                                code: 'AOA'
                            }
                        }
                    },
                    latest_transactions: [
                        {
                            id: 'tx-bai-1',
                            type: 'income',
                            amount: 500000.0,
                            from: 'outside',
                            date: { original: '2025-10-05', long: '05, Outubro de 2025', short: '05, Out 2025' },
                            description: 'Depósito mensal de poupança',
                            notes: 'Depósito automático via débito direto',
                            origin: null,
                            destination: {
                                id: 'gid-bai',
                                name: 'Comprar Televisor',
                                account: {
                                    id: 'acc-bai',
                                    name: 'Banco BAI',
                                    settings: {
                                        color: '#002D74',
                                        currency: {
                                            name: 'Angolan Kwanza',
                                            code: 'AOA'
                                        }
                                    }
                                }
                            },
                            origin_currency: { code: 'AOA' },
                            origin_rate_to_base: 0,
                            destination_rate_to_base: 0,
                            destination_currency: { code: 'AOA' }
                        }
                    ]
                },
            ],
            amount: 345343459.91,
            settings: {
                color: '#002D74',
                currency: {
                    name: 'Angolan Kwanza',
                    code: 'AOA'
                }
            }
        },
        {
            id: 'acc-atl',
            name: 'Banco Atlântico',
            type: {
                id: 'tid',
                description: 'Conta corrente',
                icon: {
                id: 6,
                reference: 'dolar',
                display: 'dolar',
                embedded_svg: '<svg></svg>'
                }
            },
            goals: [],
            amount: 545343459.91,
            settings: {
                color: '#1892AE',
                currency: {
                    name: 'Angolan Kwanza',
                    code: 'AOA'
                }
            }
        },
        {
            id: 'acc-bfa',
            name: 'Banco Bfa',
            type: {
                id: 'tid',
                description: 'Conta poupança',
                icon: {
                    id: 6,
                    reference: 'pig',
                    display: 'pig',
                    embedded_svg: '<svg></svg>'
                }
            },
            goals: [],
            amount: 545343459.91,
            settings: {
                color: '#FC8C24',
                currency: {
                    name: 'Angolan Kwanza',
                    code: 'AOA'
                }
            },
        },
        {
            id: 'acc-paypal',
            name: 'Carteira PayPal',
            type: {
                id: 'tid',
                description: 'Conta poupança',
                icon: {
                    id: 6,
                    reference: 'pig',
                    display: 'pig',
                    embedded_svg: '<svg></svg>'
                }
            },
            goals: [],
            amount: 1000,
            settings: {
                color: '#00457C',
                currency: {
                    name: 'Euro',
                    code: 'EUR'
                }
            },
        },
    ];
    private goals: DashboardGoal[] = [
        {
            id: 'gid-bai',
            name: 'Comprar Televisor',
            description: 'Poupar para comprar um novo televisor Smart 4K.',
            amount: 1250000.0,
            achievement: 2500000.0,
            excess_amount: 0,
            progress: 50,
            icon: {
                id: 1,
                reference: 'tv',
                display: 'television',
                embedded_svg: `
                <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2H15V10H2V2ZM1 11H16V12H1V11ZM7 13H10V14H7V13Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
            },
            account: {
                id: 'acc-bai',
                name: 'Banco BAI',
                settings: {
                    color: '#002D74',
                    currency: {
                        name: 'Angolan Kwanza',
                        code: 'AOA'
                    }
                }
            },
            latest_transactions: [
                {
                    id: 'tx-bai-1',
                    type: 'income',
                    amount: 500000.0,
                    from: 'outside',
                    date: { original: '2025-10-05', long: '05, Outubro de 2025', short: '05, Out 2025' },
                    description: 'Depósito mensal de poupança',
                    notes: 'Depósito automático via débito direto',
                    origin: null,
                    destination: {
                        id: 'gid-bai',
                        name: 'Comprar Televisor',
                        account: {
                            id: 'acc-bai',
                            name: 'Banco BAI',
                            settings: {
                                color: '#002D74',
                                currency: {
                                    name: 'Angolan Kwanza',
                                    code: 'AOA'
                                }
                            }
                        }
                    },
                    origin_currency: { code: 'AOA' },
                    origin_rate_to_base: 0,
                    destination_rate_to_base: 0,
                    destination_currency: { code: 'AOA' }
                },
                {
                    id: 'tx-bai-2',
                    type: 'g2g',
                    amount: 200000.0,
                    from: 'inside',
                    date: { original: '2025-10-10', long: '10, Outubro de 2025', short: '10, Out 2025'},
                    description: 'Transferência para apoio ao chinelo',
                    notes: 'Redistribuição interna',
                    origin: {
                        id: 'gid-bai',
                        name: 'Comprar Televisor',
                        account: { id: 'acc-bai', name: 'Banco BAI', settings: { color: '#002D74', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                    },
                    destination: {
                        id: 'gid-atlantico',
                        name: 'Comprar Chinelo',
                        account: { id: 'acc-atl', name: 'Banco Atlântico', settings: { color: '#1892AE', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                    },
                    origin_currency: { code: 'AOA' },
                    origin_rate_to_base: 0,
                    destination_rate_to_base: 0,
                    destination_currency: { code: 'AOA' }
                }
            ]
        },
        {
            id: 'gid-atlantico',
            name: 'Comprar Chinelo',
            description: 'Poupar para comprar um chinelo novo de verão.',
            amount: 3245323.65,
            achievement: 5000000.0,
            excess_amount: 0,
            progress: 60,
            icon: {
            id: 10,
            reference: 'car',
            display: 'car',
            embedded_svg: `<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4.3L3.26822 6.11456C3.41798 6.2344 3.60676 6.3 3.80171 6.3H13.1982C13.3932 6.3 13.582 6.2344 13.7317 6.11456L16 4.3M3.91667 9.1H3.925M13.0833 9.1H13.0917M5.30054 1.5H11.6995C12.2976 1.5 12.8498 1.80766 13.1465 2.30618L15.5608 6.36216C15.8486 6.84568 16 7.39288 16 7.94984V12.7C16 13.1418 15.6269 13.5 15.1667 13.5H14.3333C13.8731 13.5 13.5 13.1418 13.5 12.7V11.9H3.5V12.7C3.5 13.1418 3.1269 13.5 2.66667 13.5H1.83333C1.3731 13.5 1 13.1418 1 12.7V7.94984C1 7.39288 1.15138 6.84568 1.43919 6.36216L3.85347 2.30618C4.1502 1.80766 4.70244 1.5 5.30054 1.5ZM4.33333 9.1C4.33333 9.32088 4.14678 9.5 3.91667 9.5C3.68655 9.5 3.5 9.32088 3.5 9.1C3.5 8.87912 3.68655 8.7 3.91667 8.7C4.14678 8.7 4.33333 8.87912 4.33333 9.1ZM13.5 9.1C13.5 9.32088 13.3134 9.5 13.0833 9.5C12.8532 9.5 12.6667 9.32088 12.6667 9.1C12.6667 8.87912 12.8532 8.7 13.0833 8.7C13.3134 8.7 13.5 8.87912 13.5 9.1Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
            },
            account: {
            id: 'acc-atl',
            name: 'Banco Atlântico',
            settings: {
                color: '#1892AE',
                currency: {
                name: 'Angolan Kwanza',
                code: 'AOA'
                }
            }
            },
            latest_transactions: [
            {
                id: 'tx-atl-1',
                type: 'income',
                amount: 600000.0,
                from: 'outside',
                date: { original: '2025-09-10', long: '10, Setembro de  2025', short: '10, Set 2025' },
                description: 'Transferência de salário',
                notes: 'Recebimento mensal',
                origin: null,
                destination: {
                    id: 'gid-atlantico',
                    name: 'Comprar Chinelo',
                    account: { id: 'acc-atl', name: 'Banco Atlântico', settings: { color: '#1892AE', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                },
                origin_currency: { code: 'AOA' },
                origin_rate_to_base: 0,
                destination_rate_to_base: 0,
                destination_currency: { code: 'AOA' }
            },
            {
                id: 'tx-atl-2',
                type: 'g2g',
                amount: 150000.0,
                from: 'inside',
                date: { original: '2025-10-15', long: '15, Outubro de 2025', short: '15, Out 2025'},
                description: 'Transferência para meta do carro',
                notes: 'Apoio interno entre metas',
                origin: {
                    id: 'gid-atlantico',
                    name: 'Comprar Chinelo',
                    account: { id: 'acc-atl', name: 'Banco Atlântico', settings: { color: '#1892AE', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                },
                destination: {
                    id: 'gid-bfa',
                    name: 'Comprar Carro Novo',
                    account: { id: 'acc-bfa', name: 'Banco BFA', settings: { color: '#FC8C24', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                },
                origin_currency: { code: 'AOA' },
                origin_rate_to_base: 0,
                destination_rate_to_base: 0,
                destination_currency: { code: 'AOA' }
            }
            ]
        },
        {
            id: 'gid-bfa',
            name: 'Comprar Carro Novo',
            description: 'Poupança destinada à compra de um carro novo.',
            amount: 3245323.65,
            achievement: 5000000.0,
            excess_amount: 0,
            progress: 65,
            icon: {
            id: 10,
            reference: 'car',
            display: 'car',
            embedded_svg: `<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4.3L3.26822 6.11456C3.41798 6.2344 3.60676 6.3 3.80171 6.3H13.1982C13.3932 6.3 13.582 6.2344 13.7317 6.11456L16 4.3M3.91667 9.1H3.925M13.0833 9.1H13.0917M5.30054 1.5H11.6995C12.2976 1.5 12.8498 1.80766 13.1465 2.30618L15.5608 6.36216C15.8486 6.84568 16 7.39288 16 7.94984V12.7C16 13.1418 15.6269 13.5 15.1667 13.5H14.3333C13.8731 13.5 13.5 13.1418 13.5 12.7V11.9H3.5V12.7C3.5 13.1418 3.1269 13.5 2.66667 13.5H1.83333C1.3731 13.5 1 13.1418 1 12.7V7.94984C1 7.39288 1.15138 6.84568 1.43919 6.36216L3.85347 2.30618C4.1502 1.80766 4.70244 1.5 5.30054 1.5ZM4.33333 9.1C4.33333 9.32088 4.14678 9.5 3.91667 9.5C3.68655 9.5 3.5 9.32088 3.5 9.1C3.5 8.87912 3.68655 8.7 3.91667 8.7C4.14678 8.7 4.33333 8.87912 4.33333 9.1ZM13.5 9.1C13.5 9.32088 13.3134 9.5 13.0833 9.5C12.8532 9.5 12.6667 9.32088 12.6667 9.1C12.6667 8.87912 12.8532 8.7 13.0833 8.7C13.3134 8.7 13.5 8.87912 13.5 9.1Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
            },
            account: {
            id: 'acc-bfa',
            name: 'Banco BFA',
            settings: {
                color: '#FC8C24',
                currency: {
                name: 'Angolan Kwanza',
                code: 'AOA'
                }
            }
            },
            latest_transactions: [
            {
                id: 'tx-bfa-1',
                type: 'income',
                amount: 400000.0,
                from: 'outside',
                date: { original: '2025-09-10', long: '10, Setembro de  2025', short: '10, Set 2025' },
                description: 'Depósito extra',
                notes: 'Depósito feito manualmente',
                origin: null,
                destination: {
                    id: 'gid-bfa',
                    name: 'Comprar Carro Novo',
                    account: { id: 'acc-bfa', name: 'Banco BFA', settings: { color: '#FC8C24', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                },
                origin_currency: { code: 'AOA' },
                origin_rate_to_base: 0,
                destination_rate_to_base: 0,
                destination_currency: { code: 'AOA' }
            },
            {
                id: 'tx-bfa-2',
                type: 'g2g',
                amount: 150000.0,
                from: 'inside',
                date: { original: '2025-09-23', long: '23, Setembro de 2025', short: '23, Set 2025'},
                description: 'Transferência recebida do chinelo',
                notes: 'Efeito cascata interno',
                origin: {
                    id: 'gid-atlantico',
                    name: 'Comprar Chinelo',
                    account: { id: 'acc-atl', name: 'Banco Atlântico', settings: { color: '#1892AE', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                },
                destination: {
                    id: 'gid-bfa',
                    name: 'Comprar Carro Novo',
                    account: { id: 'acc-bfa', name: 'Banco BFA', settings: { color: '#FC8C24', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                },
                origin_currency: { code: 'AOA' },
                origin_rate_to_base: 0,
                destination_rate_to_base: 0,
                destination_currency: { code: 'AOA' }
            },
            {
                id: 'tx-bfa-1',
                type: 'g2g',
                amount: 384697.08,
                from: 'inside',
                date: { original: '2025-09-23', long: '23, Setembro de 2025', short: '23, Set 2025'},
                description: 'Depósito extra',
                notes: 'Depósito feito por transferência',
                origin: {
                    id: 'gid-bfa',
                    name: 'Comprar Carro Novo',
                    account: { id: 'acc-bfa', name: 'Banco BFA', settings: { color: '#FC8C24', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                },
                destination: {
                    id: 'gid-paypal',
                    name: 'Comprar casa na Europa',
                    account: { id: 'acc-paypal', name: 'Carteira PayPal', settings: { color: '#00457C', currency: { name: 'Euro', code: 'EUR' } } }
                },
                origin_currency: { code: 'AOA', rate_to_base: 1060.88 },
                origin_rate_to_base: 1068.60,
                destination_rate_to_base: 1,
                destination_currency: { code: 'EUR', rate_to_base: 1 }
            },
            {
                id: 'tx-paypal-1',
                type: 'g2g',
                amount: 200.08,
                from: 'inside',
                date: { original: '2025-09-30', long: '30, Setembro de 2025', short: '30, Set 2025'},
                description: 'Reforço para comprar carro',
                notes: 'Depósito feito por transferência',
                origin: {
                    id: 'gid-paypal',
                    name: 'Comprar casa na Europa',
                    account: { id: 'acc-paypal', name: 'Carteira PayPal', settings: { color: '#00457C', currency: { name: 'Euro', code: 'EUR', rate_to_base: 1 } } }
                },
                destination: {
                    id: 'gid-bfa',
                    name: 'Comprar Carro Novo',
                    account: { id: 'acc-bfa', name: 'Banco BFA', settings: { color: '#FC8C24', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                },
                origin_currency: { code: 'EUR', rate_to_base: 1 },
                origin_rate_to_base: 1,
                destination_rate_to_base: 1060.88,
                destination_currency: { code: 'AOA', rate_to_base: 1060.88 }
            },
            ]
        },
        {
            id: 'gid-paypal',
            name: 'Comprar casa na Europa',
            description: 'Poupança destinada à compra de uma casa na europa',
            amount: 900,
            achievement: 1500,
            excess_amount: 0,
            progress: 85,
            icon: {
            id: 10,
            reference: 'car',
            display: 'car',
            embedded_svg: `<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4.3L3.26822 6.11456C3.41798 6.2344 3.60676 6.3 3.80171 6.3H13.1982C13.3932 6.3 13.582 6.2344 13.7317 6.11456L16 4.3M3.91667 9.1H3.925M13.0833 9.1H13.0917M5.30054 1.5H11.6995C12.2976 1.5 12.8498 1.80766 13.1465 2.30618L15.5608 6.36216C15.8486 6.84568 16 7.39288 16 7.94984V12.7C16 13.1418 15.6269 13.5 15.1667 13.5H14.3333C13.8731 13.5 13.5 13.1418 13.5 12.7V11.9H3.5V12.7C3.5 13.1418 3.1269 13.5 2.66667 13.5H1.83333C1.3731 13.5 1 13.1418 1 12.7V7.94984C1 7.39288 1.15138 6.84568 1.43919 6.36216L3.85347 2.30618C4.1502 1.80766 4.70244 1.5 5.30054 1.5ZM4.33333 9.1C4.33333 9.32088 4.14678 9.5 3.91667 9.5C3.68655 9.5 3.5 9.32088 3.5 9.1C3.5 8.87912 3.68655 8.7 3.91667 8.7C4.14678 8.7 4.33333 8.87912 4.33333 9.1ZM13.5 9.1C13.5 9.32088 13.3134 9.5 13.0833 9.5C12.8532 9.5 12.6667 9.32088 12.6667 9.1C12.6667 8.87912 12.8532 8.7 13.0833 8.7C13.3134 8.7 13.5 8.87912 13.5 9.1Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
            },
            account: {
            id: 'acc-paypal',
            name: 'Carteira PayPal',
            settings: {
                color: '#00457C',
                currency: {
                name: 'Euro',
                code: 'EUR'
                }
            }
            },
            latest_transactions: [
            {
                id: 'tx-bfa-1',
                type: 'g2g',
                amount: 384697.08,
                from: 'inside',
                date: { original: '2025-10-31', long: '31, Outubro de 2025', short: '31, Out 2025'},
                description: 'Depósito extra',
                notes: 'Depósito feitopor transferência',
                origin: {
                    id: 'gid-bfa',
                    name: 'Comprar Carro Novo',
                    account: { id: 'acc-bfa', name: 'Banco BFA', settings: { color: '#FC8C24', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                },
                destination: {
                    id: 'gid-paypal',
                    name: 'Comprar casa na Europa',
                    account: { id: 'acc-paypal', name: 'Carteira PayPal', settings: { color: '#00457C', currency: { name: 'Euro', code: 'EUR', rate_to_base: 1 } } }
                },
                origin_currency: { code: 'AOA', rate_to_base: 1060.88 },
                origin_rate_to_base: 1068.60,
                destination_rate_to_base: 1,
                destination_currency: { code: 'EUR', rate_to_base: 1 }
            },
            {
                id: 'tx-paypal-1',
                type: 'g2g',
                amount: 200.08,
                from: 'inside',
                date: { original: '2025-09-30', long: '30, Setembro de 2025', short: '30, Set 2025'},
                description: 'Reforço para comprar carro',
                notes: 'Depósito feito por transferência',
                origin: {
                    id: 'gid-paypal',
                    name: 'Comprar casa na Europa',
                    account: { id: 'acc-paypal', name: 'Carteira PayPal', settings: { color: '#00457C', currency: { name: 'Euro', code: 'EUR', rate_to_base: 1 } } }
                },
                destination: {
                    id: 'gid-bfa',
                    name: 'Comprar Carro Novo',
                    account: { id: 'acc-bfa', name: 'Banco BFA', settings: { color: '#FC8C24', currency: { name: 'Angolan Kwanza', code: 'AOA' } } }
                },
                origin_currency: { code: 'EUR', rate_to_base: 1 },
                origin_rate_to_base: 1,
                destination_rate_to_base: 1060.88,
                destination_currency: { code: 'AOA', rate_to_base: 1060.88 }
            },
            ]
        }
    ];

}
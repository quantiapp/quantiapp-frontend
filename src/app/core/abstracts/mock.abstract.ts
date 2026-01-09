import { BaseAccount } from "@core/models/base-account.model";
import { BaseGoal } from "@core/models/base-goal.model";
import { BaseTransaction } from "@core/models/base-transaction.model";

export abstract class Mockery {
    protected accounts: BaseAccount<BaseGoal<BaseAccount, BaseTransaction<BaseGoal>>>[] = [
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
    protected shared_accounts = [
        {
            id: 'acc-bfa',
            name: 'Banco BFA',
            type: {
            id: 'tid',
            description: 'Conta corrente',
            icon: {
                id: 2,
                reference: 'bank',
                display: 'bank',
                embedded_svg: '<svg></svg>'
            }
            },
            goals: [
            {
                id: 'gid-bfa-1',
                name: 'Viagem a Portugal',
                description: 'Guardar dinheiro para férias em Lisboa.',
                amount: 750000.0,
                achievement: 1500000.0,
                excess_amount: 0,
                progress: 50,
                icon: {
                id: 3,
                reference: 'airplane',
                display: 'plane',
                embedded_svg: `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 8L14 8M14 8L9 3M14 8L9 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
                },
                account: {
                id: 'acc-bfa',
                name: 'Banco BFA',
                settings: {
                    color: '#F68B1E',
                    currency: { name: 'Angolan Kwanza', code: 'AOA' }
                }
                },
                latest_transactions: [
                {
                    id: 'tx-bfa-1',
                    type: 'income',
                    amount: 250000.0,
                    from: 'outside',
                    date: {
                    original: '2025-09-10',
                    long: '10, Setembro de 2025',
                    short: '10, Set 2025'
                    },
                    description: 'Transferência de salário',
                    notes: 'Depósito via salário mensal',
                    origin: null,
                    destination: {
                    id: 'gid-bfa-1',
                    name: 'Viagem a Portugal',
                    account: {
                        id: 'acc-bfa',
                        name: 'Banco BFA',
                        settings: {
                        color: '#F68B1E',
                        currency: { name: 'Angolan Kwanza', code: 'AOA' }
                        }
                    }
                    },
                    origin_currency: { code: 'AOA' },
                    origin_rate_to_base: 0,
                    destination_rate_to_base: 0,
                    destination_currency: { code: 'AOA' }
                }
                ]
            }
            ],
            amount: 2985000.55,
            settings: {
            color: '#F68B1E',
            currency: { name: 'Angolan Kwanza', code: 'AOA' }
            },
            sharing: {
            id: 'shr-bfa',
            description: 'Conta partilhada por Maria João',
            id_card: 'acc-bfa',
            id_user: 'usr-isaquias', // o utilizador logado
            income_transaction: true,
            outcome_transaction: false,
            can_see_amount: true,
            can_see_goals: true,
            can_see_transactions: true
            }
        },
        {
            id: 'acc-santander',
            name: 'Banco Santander',
            type: {
            id: 'tid',
            description: 'Conta poupança',
            icon: {
                id: 8,
                reference: 'piggy',
                display: 'piggy-bank',
                embedded_svg: '<svg></svg>'
            }
            },
            goals: [
            {
                id: 'gid-sant-1',
                name: 'Comprar Carro Novo',
                description: 'Guardar para comprar um carro elétrico.',
                amount: 1800000.0,
                achievement: 5000000.0,
                excess_amount: 0,
                progress: 36,
                icon: {
                id: 9,
                reference: 'car',
                display: 'automobile',
                embedded_svg: `
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5H17L15 1H3L1 5ZM4 8H5M13 8H14" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
                },
                account: {
                id: 'acc-santander',
                name: 'Banco Santander',
                settings: {
                    color: '#C8102E',
                    currency: { name: 'Angolan Kwanza', code: 'AOA' }
                }
                },
                latest_transactions: [
                {
                    id: 'tx-sant-1',
                    type: 'income',
                    amount: 600000.0,
                    from: 'outside',
                    date: {
                    original: '2025-09-25',
                    long: '25, Setembro de 2025',
                    short: '25, Set 2025'
                    },
                    description: 'Depósito inicial de poupança',
                    notes: 'Primeiro depósito realizado pelo dono da conta',
                    origin: null,
                    destination: {
                    id: 'gid-sant-1',
                    name: 'Comprar Carro Novo',
                    account: {
                        id: 'acc-santander',
                        name: 'Banco Santander',
                        settings: {
                        color: '#C8102E',
                        currency: { name: 'Angolan Kwanza', code: 'AOA' }
                        }
                    }
                    },
                    origin_currency: { code: 'AOA' },
                    origin_rate_to_base: 0,
                    destination_rate_to_base: 0,
                    destination_currency: { code: 'AOA' }
                }
                ]
            }
            ],
            amount: 5200000.75,
            settings: {
            color: '#C8102E',
            currency: { name: 'Angolan Kwanza', code: 'AOA' }
            },
            sharing: {
            id: 'shr-santander',
            description: 'Conta partilhada por Carlos Pinto',
            id_card: 'acc-santander',
            id_user: 'usr-isaquias', // o utilizador logado
            income_transaction: false,
            outcome_transaction: true,
            can_see_amount: true,
            can_see_goals: true,
            can_see_transactions: true
            }
        }
    ];
    protected goals = [
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
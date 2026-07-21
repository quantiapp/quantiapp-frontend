import { AccountType } from "@core/models/account-type.model";
import { AccountAccess, AccountShare, BaseAccount } from "@core/models/base-account.model";
import { BaseGoal } from "@core/models/base-goal.model";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { Currency } from "@core/models/currency.model";
import { UserSetting } from "@core/models/user-settings.model";
import { User } from "@core/models/user.model";

export abstract class Mockery {
    
    protected MOCK_USER: User = {
        id: 'usr-isaquias',
        name: "Isaquias Sebastião Marques",
        email: "patisaquias2000@gmail.com",
        username: "patisaquias2000"
    }
    
    protected MOCK_USER_SETTINGS: UserSetting = {
        language: "pt",
        locale: 'pt-AO',
        theme: "light",
        offline_mode: true,
        sharingKey: "8w2au66xabs5ircvo83gi",
        currency_id: "curr_aoa"
    }

    protected MOCK_USERS: User[] = [
        {
            id: 'usr-telma',
            name: 'Telma Tungano Tomás',
            email: 'telma@example.com',
            username: 'telma@',
        },
        {
            id: 'usr-marcos',
            name: 'Marcos Sebastião Marques',
            email: 'marcos@example.com',
            username: 'marcos@'
        },
        {
            id: 'usr-immanuel',
            name: "Immanuel Lacaio",
            email: "immanuel@example.com",
            username: "immanuel@",
            avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=65&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            id: 'usr-alexandria',
            name: "Alexandria Menezes",
            email: "alexandria@example.com",
            username: "alexandria@"
        }
    ];

    protected MOCK_USERS_SETTINGS: UserSetting[] = [
        {
            language: "pt",
            locale: "pt-AO",
            theme: "light",
            offline_mode: false,
            sharingKey: "usr-telma",
            currency_id: "curr_aoa"
        },
        {
            language: "pt",
            locale: "pt-AO",
            theme: "light",
            offline_mode: false,
            sharingKey: "usr-marcos",
            currency_id: "curr_aoa"
        },
        {
            language: "pt",
            locale: "pt-AO",
            theme: "light",
            offline_mode: false,
            sharingKey: "usr-immanuel",
            currency_id: "curr_aoa"
        },
        {
            language: "pt",
            locale: "pt-AO",
            theme: "light",
            offline_mode: false,
            sharingKey: "usr-alexandria",
            currency_id: "curr_aoa"
        }
    ];
    
    protected MOCK_ACCOUNT_TYPES: AccountType[] = [
        {
            id: 'current_account_id',
            description: 'Conta corrente',
            icon_key: 'money'
        },
        {
            id: 'saving_account_id',
            description: 'Conta poupança',
            icon_key: 'pig'
        }
    ];

    protected MOCK_CURRENCIES: Currency[] = [
        {
            id: "curr_aoa",
            name: "Angolan Kwanza",
            code: "AOA",
            is_base: false,
            rate_to_base: 1067.122885
        },
        {
            id: "curr_usd",
            name: "American Dolar",
            code: "USD",
            is_base: false,
            rate_to_base: 1.163711
        },
        {
            id: "curr_eur",
            name: "Euro",
            code: "EUR",
            is_base: true,
            rate_to_base: 1
        },
        {
            id: 'curr_brl',
            name: 'Brazilian Real',
            code: 'BRL',
            is_base: false,
            rate_to_base: 6.029299
        }
    ];

    protected MOCK_ACCOUNTS: BaseAccount[] = [
        {
            id: 'acc-bai',
            name: 'Banco Bai',
            color: '#002D74',
            currency_id: 'curr_aoa',
            account_type_id: 'current_account_id',
            balance: 0,
            share_account: true,
        },
        {
            id: 'acc-atl',
            name: 'Banco Atlântico',
            account_type_id: 'current_account_id',
            color: '#1892AE',
            currency_id: 'curr_aoa',
            balance: 0,
            share_account: false
        },
        {
            id: 'acc-bfa',
            name: 'Banco Bfa',
            account_type_id: 'saving_account_id',
            balance: 0,
            color: '#FC8C24',
            currency_id: 'curr_aoa',
            share_account: false
        },
        {
            id: 'acc-paypal',
            name: 'Carteira PayPal',
            account_type_id: 'saving_account_id',
            balance: 0,
            color: '#00457C',
            currency_id: 'curr_eur',
            share_account: false,
        },
    ];

    protected MOCK_SHARED_ACCOUNTS: BaseAccount[] = [
        {
            id: 'shrd-acc-bfa',
            name: 'Banco BFA',
            account_type_id: 'current_account_id',
            balance: 2985000.55,
            color: '#F68B1E',
            share_account: true,
            currency_id: 'curr_aoa',
            owner: 'Telma Tungano Tomás',
            permissions: {
                can_see_amount: false,
                income_transaction: true,
                can_see_goals: true,
                can_see_transactions: true,
                outcome_transaction: false
            }
        },
        {
            id: 'shrd-acc-santander',
            name: 'Banco Santander',
            account_type_id: 'saving_account_id',
            balance: 5200000.75,
            color: '#C8102E',
            share_account: true,
            currency_id: 'curr_aoa',
            owner: 'Marcos Sebastião Marques',
            permissions: {
                can_see_amount: true,
                can_see_goals: true,
                can_see_transactions: true,
                income_transaction: true,
                outcome_transaction: true
            }
        }
    ];

    protected MOCK_SHARING_ACCOUNTS: AccountShare = {
        'acc-bai': [
            {
                id: 'acc-bai',
                user: {
                    id: 'usr-immanuel',
                    name: "Immanuel Lacaio",
                    email: "immanuel@example.com",
                    username: "immanuel@",
                    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=65&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                permissions: {
                    can_see_amount: true,
                    can_see_goals: true,
                    can_see_transactions: true,
                    income_transaction: false,
                    outcome_transaction: false
                }
            },
            {
                id: 'acc-bai',
                user: {
                    id: 'usr-alexandria',
                    name: "Alexandria Menezes",
                    email: "alexandria@example.com",
                    username: "alexandria@"
                },
                permissions: {
                    can_see_amount: true,
                    can_see_goals: true,
                    can_see_transactions: true,
                    income_transaction: true,
                    outcome_transaction: false
                }
            }
        ],
    };

    protected MOCK_GOALS: BaseGoal[] = [
        {
            id: 'gid-bai',
            name: 'Comprar Televisor',
            description: 'Poupar para comprar um novo televisor Smart 4K.',
            current_amount: 1500000.0,
            target_amount: 2500000.0,
            excess_amount: 0,
            track_progress: true,
            icon_key: 'tv',
            account_id: 'acc-bai',
            last_transaction: {
                amount: 200000.0,
                from: 'inside',
                source: {
                    id: "'gid-bai'",
                    type: "goal",
                    name: "Comprar Televisor",
                    account_name: "Banco Bai",
                    currency_id: "curr_aoa",
                    rate_to_base: 1084.432259,
                    color: "#002D74"
                },
                destination: {
                    id: "gid-atlantico",
                    type: "goal",
                    name: "Comprar Chinelo",
                    account_name: "Banco Atlântico",
                    currency_id: "curr_aoa",
                    rate_to_base: 0,
                    color: "#1892AE"
                }
            }
        },
        {
            id: 'gid-bai-2',
            name: 'Comprar Televisor 2',
            description: 'Poupar para comprar um novo televisor Smart 4K.',
            current_amount: 2250000.58,
            target_amount: 5500000.0,
            excess_amount: 0,
            track_progress: true,
            icon_key: 'tv',
            account_id: 'acc-bai',
            last_transaction: null
        },
        {
            id: 'gid-atlantico',
            name: 'Comprar Chinelo',
            description: 'Poupar para comprar um chinelo novo de verão.',
            current_amount: 3245323.65,
            target_amount: 5000000.0,
            excess_amount: 0,
            track_progress: true,
            icon_key: 'car',
            account_id: 'acc-atl',
            last_transaction: {
                amount: 150000.0,
                from: 'inside',
                source: {
                    id: "gid-atlantico",
                    type: "goal",
                    name: "Comprar Chinelo",
                    account_name: "Banco Atlântico",
                    currency_id: "curr_aoa",
                    rate_to_base: 0,
                    color: "#1892AE"
                },
                destination: {
                    id: "gid-bfa",
                    type: "goal",
                    name: "Comprar Carro Novo",
                    account_name: "Banco BFA",
                    currency_id: "curr_aoa",
                    rate_to_base: 0,
                    color: "#FC8C24"
                }
            },
        },
        {
            id: 'gid-bfa',
            name: 'Comprar Carro Novo',
            description: 'Poupança destinada à compra de um carro novo.',
            current_amount: 3245323.65,
            target_amount: 5000000.0,
            excess_amount: 0,
            track_progress: true,
            icon_key: 'car',
            account_id: 'acc-bfa',
            last_transaction: {
                amount: 200.08,
                from: 'inside',
                source: {
                    id: "gid-paypal",
                    type: "goal",
                    name: "Comprar casa na Europa",
                    account_name: "Carteira PayPal",
                    currency_id: "curr_eur",
                    rate_to_base: 1,
                    color: "#00457C"
                },
                destination: {
                    id: "gid-bfa",
                    type: "goal",
                    name: "Comprar Carro Novo",
                    account_name: "Banco BFA",
                    currency_id: "curr_aoa",
                    rate_to_base: 1060.88,
                    color: "#FC8C24"
                }
            }
        },
        {
            id: 'gid-paypal',
            name: 'Comprar casa na Europa',
            description: 'Poupança destinada à compra de uma casa na europa',
            current_amount: 900,
            target_amount: 1500,
            excess_amount: 0,
            track_progress: true,
            icon_key: 'car',
            account_id: 'acc-paypal',
            last_transaction: {
                amount: 200.08,
                from: 'inside',
                source: {
                    id: "gid-paypal",
                    type: "goal",
                    name: "Comprar casa na Europa",
                    account_name: "Carteira PayPal",
                    currency_id: "curr_eur",
                    rate_to_base: 1,
                    color: "#00457C"
                },
                destination: {
                    id: "gid-bfa",
                    type: "goal",
                    name: "Comprar Carro Novo",
                    account_name: "Banco BFA",
                    currency_id: "curr_aoa",
                    rate_to_base: 1060.88,
                    color: "#FC8C24"
                }
            }
        }
    ];

    protected MOCK_SHARED_GOALS: BaseGoal[] = [
        // ─────────────────────────────
        // BFA (partilhada - não pode ver amount)
        // ─────────────────────────────
        {
            id: 'gid-shrd-bfa-1',
            name: 'Fundo de Emergência Familiar',
            description: 'Reserva financeira para emergências.',
            current_amount: 1200000.0,
            target_amount: 3000000.0,
            excess_amount: 0,
            track_progress: true,
            icon_key: 'shield',
            account_id: 'shrd-acc-bfa',
            last_transaction: {
                amount: 250000.0,
                from: 'inside',
                source: {
                    id: "gid-shrd-sant-1",
                    type: "goal",
                    name: "Investimento Imobiliário",
                    account_name: "Banco Santander",
                    owner: 'Marcos Sebastião Marques',
                    currency_id: "curr_aoa",
                    rate_to_base: 0,
                    color: "#C8102E"
                },
                destination: {
                    id: "gid-shrd-sant-1",
                    type: "goal",
                    name: "Investimento Imobiliário",
                    account_name: "Banco Santander",
                    owner: 'Marcos Sebastião Marques',
                    currency_id: "curr_aoa",
                    rate_to_base: 0,
                    color: "#C8102E"
                }
            }
        },
        {
            id: 'gid-shrd-bfa-2',
            name: 'Educação dos Filhos',
            description: 'Poupança para propinas futuras.',
            current_amount: 800000.0,
            target_amount: 2000000.0,
            excess_amount: 0,
            track_progress: true,
            icon_key: 'book',
            account_id: 'shrd-acc-bfa',
            last_transaction: null
        },
        // ─────────────────────────────
        // SANTANDER (partilhada - pode ver tudo)
        // ─────────────────────────────
        {
            id: 'gid-shrd-sant-1',
            name: 'Investimento Imobiliário',
            description: 'Entrada para aquisição de imóvel.',
            current_amount: 2500000.0,
            target_amount: 6000000.0,
            excess_amount: 0,
            track_progress: true,
            icon_key: 'home',
            account_id: 'shrd-acc-santander',
            last_transaction: {
                amount: 500000.0,
                from: 'outside',
                source: null,
                destination: {
                    id: "gid-shrd-sant-1",
                    type: "goal",
                    name: "Investimento Imobiliário",
                    account_name: "Banco Santander",
                owner: 'Marcos Sebastião Marques',
                    currency_id: "curr_aoa",
                    rate_to_base: 0,
                    color: "#C8102E"
                }
            }
        }
    ];

    protected MOCK_GOALS_MERGED: BaseGoal[] = [
        ...this.MOCK_GOALS,
        ...this.MOCK_SHARED_GOALS
    ];

    protected MOCK_TRANSACTIONS: BaseTransaction[] = [
        // ─────────────────────────────────────────────
        // BAI → Comprar Televisor
        // ─────────────────────────────────────────────
        {
            id: 'tx-bai-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 500000.0,
            from: 'outside',
            date: '2025-10-05',
            description: 'Depósito mensal de poupança',
            notes: 'Depósito automático via débito direto',
            source: null,
            destination: {
                id: 'gid-bai',
                type: "goal",
                name: "Comprar Televisor",
                account_name: "Banco Bai",
                currency_id: "curr_aoa",
                rate_to_base: 1084.432259,
                color: "#002D74"
            }
        },

        {
            id: 'tx-bai-2',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'g2g',
            amount: 200000.0,
            from: 'inside',
            date: '2025-10-10',
            description: 'Transferência para apoio ao chinelo',
            notes: 'Redistribuição interna',
            source: {
                id: "'gid-bai'",
                type: "goal",
                name: "Comprar Televisor",
                account_name: "Banco Bai",
                currency_id: "curr_aoa",
                rate_to_base: 1084.432259,
                color: "#002D74"
            },
            destination: {
                id: "gid-atlantico",
                type: "goal",
                name: "Comprar Chinelo",
                account_name: "Banco Atlântico",
                currency_id: "curr_aoa",
                rate_to_base: 0,
                color: "#1892AE"
            }
        },

        // ─────────────────────────────────────────────
        // ATLÂNTICO → Comprar Chinelo
        // ─────────────────────────────────────────────
        {
            id: 'tx-atl-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 600000.0,
            from: 'outside',
            date: '2025-09-10',
            description: 'Transferência de salário',
            notes: 'Recebimento mensal',
            source: null,
            destination: {
                id: "gid-atlantico",
                type: "goal",
                name: "Comprar Chinelo",
                account_name: "Banco Atlântico",
                currency_id: "curr_aoa",
                rate_to_base: 0,
                color: "#1892AE"
            }
        },

        {
            id: 'tx-atl-2',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'g2g',
            amount: 150000.0,
            from: 'inside',
            date: '2025-10-15',
            description: 'Transferência para meta do carro',
            notes: 'Apoio interno entre metas',
            source: {
                id: "gid-atlantico",
                type: "goal",
                name: "Comprar Chinelo",
                account_name: "Banco Atlântico",
                currency_id: "curr_aoa",
                rate_to_base: 0,
                color: "#1892AE"
            },
            destination: {
                id: "gid-bfa",
                type: "goal",
                name: "Comprar Carro Novo",
                account_name: "Banco BFA",
                currency_id: "curr_aoa",
                rate_to_base: 0,
                color: "#FC8C24"
            }
        },

        // ─────────────────────────────────────────────
        // BFA → Comprar Carro Novo
        // ─────────────────────────────────────────────
        {
            id: 'tx-bfa-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 400000.0,
            from: 'outside',
            date: '2025-09-10',
            description: 'Depósito extra',
            notes: 'Depósito feito manualmente',
            source: null,
            destination: {
                id: "gid-bfa",
                type: "goal",
                name: "Comprar Carro Novo",
                account_name: "Banco BFA",
                currency_id: "curr_aoa",
                rate_to_base: 0,
                color: "#FC8C24"
            }
        },

        {
            id: 'tx-bfa-2',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'g2g',
            amount: 150000.0,
            from: 'inside',
            date: '2025-09-23',
            description: 'Transferência recebida do chinelo',
            notes: 'Efeito cascata interno',
            source: {
                id: "gid-atlantico",
                type: "goal",
                name: "Comprar Chinelo",
                account_name: "Banco Atlântico",
                currency_id: "curr_aoa",
                rate_to_base: 0,
                color: "#1892AE"
            },
            destination: {
                id: "gid-bfa",
                type: "goal",
                name: "Comprar Carro Novo",
                account_name: "Banco BFA",
                currency_id: "curr_aoa",
                rate_to_base: 0,
                color: "#FC8C24"
            }
        },

        {
            id: 'tx-bfa-3',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'g2g',
            amount: 384697.08,
            from: 'inside',
            date: '2025-09-25',
            description: 'Envio para poupança internacional',
            notes: 'Conversão de moeda AOA → EUR',
            source:  {
                id: "gid-bfa",
                type: "goal",
                name: "Comprar Carro Novo",
                account_name: "Banco BFA",
                currency_id: "curr_aoa",
                rate_to_base: 1060.88,
                color: "#FC8C24"
            },
            destination: {
                id: "gid-paypal",
                type: "goal",
                name: "Comprar casa na Europa",
                account_name: "Carteira PayPal",
                currency_id: "curr_eur",
                rate_to_base: 1,
                color: "#00457C"
            }
        },

        // ─────────────────────────────────────────────
        // PAYPAL → Comprar casa na Europa
        // ─────────────────────────────────────────────
        {
            id: 'tx-paypal-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'g2g',
            amount: 200.08,
            from: 'inside',
            date: '2025-09-30',
            description: 'Reforço para comprar carro',
            notes: 'Conversão EUR → AOA',
            source: {
                id: "gid-paypal",
                type: "goal",
                name: "Comprar casa na Europa",
                account_name: "Carteira PayPal",
                currency_id: "curr_eur",
                rate_to_base: 1,
                color: "#00457C"
            },
            destination: {
                id: "gid-bfa",
                type: "goal",
                name: "Comprar Carro Novo",
                account_name: "Banco BFA",
                currency_id: "curr_aoa",
                rate_to_base: 1060.88,
                color: "#FC8C24"
            }
        },

        // ─────────────────────────────────────────────
        // EXTRA — reforço interno PAYPAL
        // ─────────────────────────────────────────────
        {
            id: 'tx-paypal-2',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 300.0,
            from: 'outside',
            date: '2025-10-02',
            description: 'Depósito externo internacional',
            notes: 'Transferência recebida em EUR',
            source: null,
            destination: {
                id: "gid-paypal",
                type: "goal",
                name: "Comprar casa na Europa",
                account_name: "Carteira PayPal",
                currency_id: "curr_eur",
                rate_to_base: 1,
                color: "#00457C"
            }
        }
    ];

    protected MOCK_SHARED_TRANSACTIONS: BaseTransaction[] = [
        // ─────────────────────────────
        // Income normal BFA
        // ─────────────────────────────
        {
            id: 'tx-shrd-bfa-1',
            register: { email: 'telma@example.com' },
            type: 'income',
            amount: 400000.0,
            from: 'outside',
            date: '2026-01-10',
            description: 'Reforço mensal familiar',
            notes: 'Depósito efetuado pelo titular',
            source: null,
            destination: {
                id: 'gid-shrd-bfa-1',
                type: "goal",
                name: "Fundo de Emergência Familiar",
                account_name: "Banco BFA",
                currency_id: "curr_aoa",
                owner: 'Telma Tungano Tomás',
                rate_to_base: 0,
                color: "#F68B1E"
            }
        },

        // ─────────────────────────────
        // G2G entre contas partilhadas
        // (BFA → Santander)
        // ─────────────────────────────
        {
            id: 'tx-shrd-cross-1',
            register: { email: 'telma@example.com' },
            type: 'g2g',
            amount: 250000.0,
            from: 'inside',
            date: '2026-02-01',
            description: 'Apoio ao investimento imobiliário',
            notes: 'Transferência entre contas partilhadas',
            source: {
                id: 'gid-shrd-bfa-1',
                type: "goal",
                name: "Fundo de Emergência Familiar",
                account_name: "Banco BFA",
                currency_id: "curr_aoa",
                owner: 'Telma Tungano Tomás',
                rate_to_base: 0,
                color: "#F68B1E"
            },
            destination: {
                id: 'gid-shrd-sant-1',
                type: "goal",
                name: "Investimento Imobiliário",
                account_name: "Banco Santander",
                owner: 'Marcos Sebastião Marques',
                currency_id: "curr_aoa",
                rate_to_base: 0,
                color: "#C8102E"
            }
        },

        // ─────────────────────────────
        // Outcome (pagamento externo)
        // ─────────────────────────────
        {
            id: 'tx-shrd-sant-2',
            register: { email: 'marcos@example.com' },
            type: 'outcome',
            amount: 300000.0,
            from: 'inside',
            date: '2026-02-05',
            description: 'Pagamento de reserva de imóvel',
            notes: 'Pagamento feito ao promotor',
            source: {
                id: "gid-shrd-sant-1",
                type: "goal",
                name: "Investimento Imobiliário",
                account_name: "Banco Santander",
                owner: 'Marcos Sebastião Marques',
                currency_id: "curr_aoa",
                rate_to_base: 0,
                color: "#C8102E"
            },
            destination: null
        },

        // ─────────────────────────────
        // G2G PARA CONTA PRIVADA (NÃO ACESSÍVEL)
        // ─────────────────────────────
        {
            id: 'tx-shrd-private-1',
            register: { email: 'marcos@example.com' },
            type: 'g2g',
            amount: 180000.0,
            from: 'inside',
            date: '2026-02-08',
            description: 'Transferência para parceiro externo',
            notes: 'Destino não visível ao utilizador',
            source: {
                id: 'gid-shrd-sant-1',
                type: "goal",
                name: "Investimento Imobiliário",
                account_name: "Banco Santander",
                owner: 'Marcos Sebastião Marques',
                currency_id: "curr_aoa",
                rate_to_base: 0,
                color: "#C8102E"
            },
            destination: {
                id: 'gid-private-ext-1',
                type: "goal",
                name: "Meta privada",
                account_name: "Conta privada",
                currency_id: "curr_aoa",
                rate_to_base: 0,
                color: "#ffcc00"
            }
        }
    ];

    protected MOCK_TRANSACTIONS_MERGE: BaseTransaction[] = [
        ...this.MOCK_TRANSACTIONS,
        ...this.MOCK_SHARED_TRANSACTIONS
    ];

    protected MOCK_TRANSACTIONS_EXTENDED: BaseTransaction[] = [
        ...this.MOCK_TRANSACTIONS,
        ...this.MOCK_SHARED_TRANSACTIONS,
        {
            id: 'tx-ext-jun-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 750000.0,
            from: 'outside',
            date: '2026-06-15',
            description: 'Salário de Junho',
            notes: 'Depósito de salário mensal',
            source: null,
            destination: {
                id: 'gid-bai',
                type: 'goal',
                name: 'Comprar Televisor',
                account_name: 'Banco Bai',
                currency_id: 'curr_aoa',
                rate_to_base: 1084.432259,
                color: '#002D74'
            }
        },
        {
            id: 'tx-ext-jun-2',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'g2g',
            amount: 100000.0,
            from: 'inside',
            date: '2026-06-18',
            description: 'Reforço Smart TV 2',
            notes: 'Transferência de meta 1 para meta 2',
            source: {
                id: 'gid-bai',
                type: 'goal',
                name: 'Comprar Televisor',
                account_name: 'Banco Bai',
                currency_id: 'curr_aoa',
                rate_to_base: 1084.432259,
                color: '#002D74'
            },
            destination: {
                id: 'gid-bai-2',
                type: 'goal',
                name: 'Comprar Televisor 2',
                account_name: 'Banco Bai',
                currency_id: 'curr_aoa',
                rate_to_base: 1084.432259,
                color: '#002D74'
            }
        },
        {
            id: 'tx-ext-jun-3',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'outcome',
            amount: 45000.0,
            from: 'inside',
            date: '2026-06-20',
            description: 'Manutenção de viatura',
            notes: 'Pagamento de revisão mecânica',
            source: {
                id: 'gid-bfa',
                type: 'goal',
                name: 'Comprar Carro Novo',
                account_name: 'Banco BFA',
                currency_id: 'curr_aoa',
                rate_to_base: 1060.88,
                color: '#FC8C24'
            },
            destination: null
        },
        {
            id: 'tx-ext-may-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 750000.0,
            from: 'outside',
            date: '2026-05-15',
            description: 'Salário de Maio',
            notes: 'Depósito de salário mensal',
            source: null,
            destination: {
                id: 'gid-bai',
                type: 'goal',
                name: 'Comprar Televisor',
                account_name: 'Banco Bai',
                currency_id: 'curr_aoa',
                rate_to_base: 1084.432259,
                color: '#002D74'
            }
        },
        {
            id: 'tx-ext-may-2',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'g2g',
            amount: 300000.0,
            from: 'inside',
            date: '2026-05-20',
            description: 'Investimento Casa Europa',
            notes: 'Poupança internacional',
            source: {
                id: 'gid-bfa',
                type: 'goal',
                name: 'Comprar Carro Novo',
                account_name: 'Banco BFA',
                currency_id: 'curr_aoa',
                rate_to_base: 1060.88,
                color: '#FC8C24'
            },
            destination: {
                id: 'gid-paypal',
                type: 'goal',
                name: 'Comprar casa na Europa',
                account_name: 'Carteira PayPal',
                currency_id: 'curr_eur',
                rate_to_base: 1,
                color: '#00457C'
            }
        },
        {
            id: 'tx-ext-may-3',
            register: { email: 'telma@example.com' },
            type: 'income',
            amount: 200000.0,
            from: 'outside',
            date: '2026-05-25',
            description: 'Apoio Familiar Mensal',
            notes: 'Depósito compartilhado',
            source: null,
            destination: {
                id: 'gid-shrd-bfa-1',
                type: 'goal',
                name: 'Fundo de Emergência Familiar',
                account_name: 'Banco BFA',
                owner: 'Telma Tungano Tomás',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#F68B1E'
            }
        },
        {
            id: 'tx-ext-apr-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 750000.0,
            from: 'outside',
            date: '2026-04-15',
            description: 'Salário de Abril',
            notes: 'Depósito de salário mensal',
            source: null,
            destination: {
                id: 'gid-bai',
                type: 'goal',
                name: 'Comprar Televisor',
                account_name: 'Banco Bai',
                currency_id: 'curr_aoa',
                rate_to_base: 1084.432259,
                color: '#002D74'
            }
        },
        {
            id: 'tx-ext-apr-2',
            register: { email: 'telma@example.com' },
            type: 'outcome',
            amount: 50000.0,
            from: 'inside',
            date: '2026-04-20',
            description: 'Compra de livros escolares',
            notes: 'Material didático para filhos',
            source: {
                id: 'gid-shrd-bfa-2',
                type: 'goal',
                name: 'Educação dos Filhos',
                account_name: 'Banco BFA',
                owner: 'Telma Tungano Tomás',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#F68B1E'
            },
            destination: null
        },
        {
            id: 'tx-ext-apr-3',
            register: { email: 'marcos@example.com' },
            type: 'income',
            amount: 150000.0,
            from: 'outside',
            date: '2026-04-22',
            description: 'Reforço Imobiliário',
            notes: 'Poupança extra',
            source: null,
            destination: {
                id: 'gid-shrd-sant-1',
                type: 'goal',
                name: 'Investimento Imobiliário',
                account_name: 'Banco Santander',
                owner: 'Marcos Sebastião Marques',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#C8102E'
            }
        },
        {
            id: 'tx-ext-mar-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 750000.0,
            from: 'outside',
            date: '2026-03-15',
            description: 'Salário de Março',
            notes: 'Depósito de salário mensal',
            source: null,
            destination: {
                id: 'gid-bai',
                type: 'goal',
                name: 'Comprar Televisor',
                account_name: 'Banco Bai',
                currency_id: 'curr_aoa',
                rate_to_base: 1084.432259,
                color: '#002D74'
            }
        },
        {
            id: 'tx-ext-mar-2',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'g2g',
            amount: 200000.0,
            from: 'inside',
            date: '2026-03-18',
            description: 'Reforço para Carro',
            notes: 'Transferência Bai para BFA',
            source: {
                id: 'gid-atlantico',
                type: 'goal',
                name: 'Comprar Chinelo',
                account_name: 'Banco Atlântico',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#1892AE'
            },
            destination: {
                id: 'gid-bfa',
                type: 'goal',
                name: 'Comprar Carro Novo',
                account_name: 'Banco BFA',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#FC8C24'
            }
        },
        {
            id: 'tx-ext-mar-3',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'outcome',
            amount: 120000.0,
            from: 'inside',
            date: '2026-03-22',
            description: 'Seguro automóvel',
            notes: 'Prémio trimestral',
            source: {
                id: 'gid-bfa',
                type: 'goal',
                name: 'Comprar Carro Novo',
                account_name: 'Banco BFA',
                currency_id: 'curr_aoa',
                rate_to_base: 1060.88,
                color: '#FC8C24'
            },
            destination: null
        },
        {
            id: 'tx-ext-feb-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 100000.0,
            from: 'outside',
            date: '2026-02-10',
            description: 'Reembolso PayPal',
            notes: 'Estorno de compra online',
            source: null,
            destination: {
                id: 'gid-paypal',
                type: 'goal',
                name: 'Comprar casa na Europa',
                account_name: 'Carteira PayPal',
                currency_id: 'curr_eur',
                rate_to_base: 1,
                color: '#00457C'
            }
        },
        {
            id: 'tx-ext-feb-2',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'g2g',
            amount: 50000.0,
            from: 'inside',
            date: '2026-02-18',
            description: 'Ajuste de saldo',
            notes: 'Ajuste de orçamento',
            source: {
                id: 'gid-bai',
                type: 'goal',
                name: 'Comprar Televisor',
                account_name: 'Banco Bai',
                currency_id: 'curr_aoa',
                rate_to_base: 1084.432259,
                color: '#002D74'
            },
            destination: {
                id: 'gid-atlantico',
                type: 'goal',
                name: 'Comprar Chinelo',
                account_name: 'Banco Atlântico',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#1892AE'
            }
        },
        {
            id: 'tx-ext-jan-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 250000.0,
            from: 'outside',
            date: '2026-01-05',
            description: 'Poupancas Ano Novo',
            notes: 'Depósito inicial anual',
            source: null,
            destination: {
                id: 'gid-bfa',
                type: 'goal',
                name: 'Comprar Carro Novo',
                account_name: 'Banco BFA',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#FC8C24'
            }
        },
        {
            id: 'tx-ext-jan-2',
            register: { email: 'telma@example.com' },
            type: 'g2g',
            amount: 80000.0,
            from: 'inside',
            date: '2026-01-15',
            description: 'Transferência Emergência Imobiliária',
            notes: 'Apoio entre metas partilhadas',
            source: {
                id: 'gid-shrd-bfa-1',
                type: 'goal',
                name: 'Fundo de Emergência Familiar',
                account_name: 'Banco BFA',
                owner: 'Telma Tungano Tomás',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#F68B1E'
            },
            destination: {
                id: 'gid-shrd-sant-1',
                type: 'goal',
                name: 'Investimento Imobiliário',
                account_name: 'Banco Santander',
                owner: 'Marcos Sebastião Marques',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#C8102E'
            }
        },
        {
            id: 'tx-ext-dec-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 750000.0,
            from: 'outside',
            date: '2025-12-15',
            description: 'Salário de Dezembro',
            notes: 'Depósito de salário mensal com subsídio',
            source: null,
            destination: {
                id: 'gid-bai',
                type: 'goal',
                name: 'Comprar Televisor',
                account_name: 'Banco Bai',
                currency_id: 'curr_aoa',
                rate_to_base: 1084.432259,
                color: '#002D74'
            }
        },
        {
            id: 'tx-ext-dec-2',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'g2g',
            amount: 100000.0,
            from: 'inside',
            date: '2025-12-20',
            description: 'Reforço de Férias',
            notes: 'Transferência BFA para Atlântico',
            source: {
                id: 'gid-bfa',
                type: 'goal',
                name: 'Comprar Carro Novo',
                account_name: 'Banco BFA',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#FC8C24'
            },
            destination: {
                id: 'gid-atlantico',
                type: 'goal',
                name: 'Comprar Chinelo',
                account_name: 'Banco Atlântico',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#1892AE'
            }
        },
        {
            id: 'tx-ext-nov-1',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'income',
            amount: 650000.0,
            from: 'outside',
            date: '2025-11-10',
            description: 'Salário de Novembro',
            notes: 'Depósito de salário',
            source: null,
            destination: {
                id: 'gid-bai',
                type: 'goal',
                name: 'Comprar Televisor',
                account_name: 'Banco Bai',
                currency_id: 'curr_aoa',
                rate_to_base: 1084.432259,
                color: '#002D74'
            }
        },
        {
            id: 'tx-ext-nov-2',
            register: { email: 'patisaquias2000@gmail.com' },
            type: 'outcome',
            amount: 30000.0,
            from: 'inside',
            date: '2025-11-15',
            description: 'Pagamento de fatura de internet',
            notes: 'Débito automático mensal',
            source: {
                id: 'gid-atlantico',
                type: 'goal',
                name: 'Comprar Chinelo',
                account_name: 'Banco Atlântico',
                currency_id: 'curr_aoa',
                rate_to_base: 0,
                color: '#1892AE'
            },
            destination: null
        }
    ];

}
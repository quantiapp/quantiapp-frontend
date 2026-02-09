import { AccountType } from "@core/models/account-type.model";
import { BaseAccount } from "@core/models/base-account.model";
import { BaseGoal } from "@core/models/base-goal.model";
import { BaseTransaction } from "@core/models/base-transaction.model";
import { Currency } from "@core/models/currency.model";
import { UserSetting } from "@core/models/user-settings.model";
import { User } from "@core/models/user.model";

export abstract class Mockery {
    
    protected MOCK_USER: User = {
        name: "Isaquias Sebastião Marques",
        email: "patisaquias2000@gmail.com",
        username: "patisaquias2000"
    }

    protected MOCK_USER_SETTINGS: UserSetting = {
        language: "pt",
        locale: 'pt-PT',
        theme: "light",
        sharingKey: "8w2au66xabs5ircvo83gi",
        currency_id: "curr_aoa"
    }
    
    protected MOCK_ACCOUNT_TYPES: AccountType[] = [
        {
            id: 'current_account_id',
            description: 'Conta corrente',
            icon_key: 'dolar'
        },
        {
            id: 'saving_account_id',
            description: 'Conta Poupança',
            icon_key: 'pig'
        }
    ];

    protected MOCK_CURRENCIES: Currency[] = [
        {
            id: "curr_aoa",
            name: "Angolan Kwanza",
            code: "AOA",
            is_base: false,
            rate_to_base: 1083.663344
        },
        {
            id: "curr_usd",
            name: "American Dolar",
            code: "USD",
            is_base: false,
            rate_to_base: 1.181748
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
            rate_to_base: 6.165657
        }
    ];

    protected MOCK_ACCOUNTS: BaseAccount[] = [
        {
            id: 'acc-bai',
            name: 'Banco Bai',
            color: '#002D74',
            currency_id: 'curr_aoa',
            account_type_id: 'current_account_id',
            balance: 0
        },
        {
            id: 'acc-atl',
            name: 'Banco Atlântico',
            account_type_id: 'current_account_id',
            color: '#1892AE',
            currency_id: 'curr_aoa',
            balance: 0
        },
        {
            id: 'acc-bfa',
            name: 'Banco Bfa',
            account_type_id: 'saving_account_id',
            balance: 0,
            color: '#FC8C24',
            currency_id: 'curr_aoa'
        },
        {
            id: 'acc-paypal',
            name: 'Carteira PayPal',
            account_type_id: 'saving_account_id',
            balance: 0,
            color: '#00457C',
            currency_id: 'curr_eur',
        },
    ];

    protected MOCK_SHARED_ACCOUNTS: BaseAccount[] = [
        {
            id: 'acc-bfa',
            name: 'Banco BFA',
            account_type_id: 'current_account_id',
            balance: 2985000.55,
            color: '#F68B1E',
            currency_id: 'curr_aoa',
            owner: 'Telma Tungano Tomás',
            permissions: {
                can_see_amount: false,
                can_see_goals: true,
                can_see_transactions: true
            }
        },
        {
            id: 'acc-santander',
            name: 'Banco Santander',
            account_type_id: 'saving_account_id',
            balance: 5200000.75,
            color: '#C8102E',
            currency_id: 'curr_aoa',
            owner: 'Marcos Sebastião Marques',
            permissions: {
                can_see_amount: true,
                can_see_goals: true,
                can_see_transactions: true
            }
        }
    ];

    protected MOCK_GOALS: BaseGoal[] = [
        {
            id: 'gid-bai',
            name: 'Comprar Televisor',
            description: 'Poupar para comprar um novo televisor Smart 4K.',
            current_amount: 1250000.0,
            target_amount: 2500000.0,
            excess_amount: 0,
            icon_key: 'tv',
            account_id: 'acc-bai',
            last_transaction: {
                amount: 200000.0,
                from: 'inside',
                origin_id: 'gid-bai',
                destination_id: 'gid-atlantico',
                origin_currency_id: 'curr_aoa',
                origin_rate_to_base: 0,
                destination_rate_to_base: 0,
                destination_currency_id: 'curr_aoa'
            }
        },
        {
            id: 'gid-bai-2',
            name: 'Comprar Televisor 2',
            description: 'Poupar para comprar um novo televisor Smart 4K.',
            current_amount: 2250000.58,
            target_amount: 5500000.0,
            excess_amount: 0,
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
            icon_key: 'car',
            account_id: 'acc-atl',
            last_transaction: {
                amount: 150000.0,
                from: 'inside',
                origin_id: 'gid-atlantico',
                destination_id: 'gid-bfa',
                origin_currency_id: 'curr_aoa',
                origin_rate_to_base: 0,
                destination_rate_to_base: 0,
                destination_currency_id: 'curr_aoa'
            },
        },
        {
            id: 'gid-bfa',
            name: 'Comprar Carro Novo',
            description: 'Poupança destinada à compra de um carro novo.',
            current_amount: 3245323.65,
            target_amount: 5000000.0,
            excess_amount: 0,
            icon_key: 'car',
            account_id: 'acc-bfa',
            last_transaction: {
                amount: 200.08,
                from: 'inside',
                origin_id: 'gid-paypal',
                destination_id: 'gid-bfa',
                origin_currency_id: 'curr_eur',
                origin_rate_to_base: 1,
                destination_rate_to_base: 1060.88,
                destination_currency_id: 'curr_aoa'
            }
        },
        {
            id: 'gid-paypal',
            name: 'Comprar casa na Europa',
            description: 'Poupança destinada à compra de uma casa na europa',
            current_amount: 900,
            target_amount: 1500,
            excess_amount: 0,
            icon_key: 'car',
            account_id: 'acc-paypal',
            last_transaction: {
                amount: 200.08,
                from: 'inside',
                origin_id: 'gid-paypal',
                destination_id: 'gid-bfa',
                origin_currency_id: 'curr_eur',
                origin_rate_to_base: 1,
                destination_rate_to_base: 1060.88,
                destination_currency_id: 'curr_aoa'
            }
        }
    ];

    protected MOCK_TRANSACTIONS: BaseTransaction[] = [
        // ─────────────────────────────────────────────
        // BAI → Comprar Televisor
        // ─────────────────────────────────────────────
        {
            id: 'tx-bai-1',
            type: 'income',
            amount: 500000.0,
            from: 'outside',
            date: '2025-10-05',
            description: 'Depósito mensal de poupança',
            notes: 'Depósito automático via débito direto',
            origin_id: null,
            origin_currency_id: null,
            destination_id: 'gid-bai',
            destination_currency_id: 'curr_aoa',
            origin_rate_to_base: 0,
            destination_rate_to_base: 1084.432259
        },

        {
            id: 'tx-bai-2',
            type: 'g2g',
            amount: 200000.0,
            from: 'inside',
            date: '2025-10-10',
            description: 'Transferência para apoio ao chinelo',
            notes: 'Redistribuição interna',
            origin_id: 'gid-bai',
            destination_id: 'gid-atlantico',
            origin_currency_id: 'curr_aoa',
            origin_rate_to_base: 0,
            destination_rate_to_base: 0,
            destination_currency_id: 'curr_aoa'
        },

        // ─────────────────────────────────────────────
        // ATLÂNTICO → Comprar Chinelo
        // ─────────────────────────────────────────────
        {
            id: 'tx-atl-1',
            type: 'income',
            amount: 600000.0,
            from: 'outside',
            date: '2025-09-10',
            description: 'Transferência de salário',
            notes: 'Recebimento mensal',
            origin_id: null,
            origin_currency_id: null,
            destination_id: 'gid-atlantico',
            destination_currency_id: 'curr_aoa',
            origin_rate_to_base: 0,
            destination_rate_to_base: 0
        },

        {
            id: 'tx-atl-2',
            type: 'g2g',
            amount: 150000.0,
            from: 'inside',
            date: '2025-10-15',
            description: 'Transferência para meta do carro',
            notes: 'Apoio interno entre metas',
            origin_id: 'gid-atlantico',
            destination_id: 'gid-bfa',
            origin_currency_id: 'curr_aoa',
            origin_rate_to_base: 0,
            destination_rate_to_base: 0,
            destination_currency_id: 'curr_aoa'
        },

        // ─────────────────────────────────────────────
        // BFA → Comprar Carro Novo
        // ─────────────────────────────────────────────
        {
            id: 'tx-bfa-1',
            type: 'income',
            amount: 400000.0,
            from: 'outside',
            date: '2025-09-10',
            description: 'Depósito extra',
            notes: 'Depósito feito manualmente',
            origin_id: null,
            origin_currency_id: null,
            destination_id: 'gid-bfa',
            destination_currency_id: 'curr_aoa',
            origin_rate_to_base: 0,
            destination_rate_to_base: 0
        },

        {
            id: 'tx-bfa-2',
            type: 'g2g',
            amount: 150000.0,
            from: 'inside',
            date: '2025-09-23',
            description: 'Transferência recebida do chinelo',
            notes: 'Efeito cascata interno',
            origin_id: 'gid-atlantico',
            destination_id: 'gid-bfa',
            origin_currency_id: 'curr_aoa',
            origin_rate_to_base: 0,
            destination_rate_to_base: 0,
            destination_currency_id: 'curr_aoa'
        },

        {
            id: 'tx-bfa-3',
            type: 'g2g',
            amount: 384697.08,
            from: 'inside',
            date: '2025-09-25',
            description: 'Envio para poupança internacional',
            notes: 'Conversão de moeda AOA → EUR',
            origin_id: 'gid-bfa',
            destination_id: 'gid-paypal',
            origin_currency_id: 'curr_aoa',
            origin_rate_to_base: 1068.6,
            destination_rate_to_base: 1,
            destination_currency_id: 'curr_eur'
        },

        // ─────────────────────────────────────────────
        // PAYPAL → Comprar casa na Europa
        // ─────────────────────────────────────────────
        {
            id: 'tx-paypal-1',
            type: 'g2g',
            amount: 200.08,
            from: 'inside',
            date: '2025-09-30',
            description: 'Reforço para comprar carro',
            notes: 'Conversão EUR → AOA',
            origin_id: 'gid-paypal',
            destination_id: 'gid-bfa',
            origin_currency_id: 'curr_eur',
            origin_rate_to_base: 1,
            destination_rate_to_base: 1060.88,
            destination_currency_id: 'curr_aoa'
        },

        // ─────────────────────────────────────────────
        // EXTRA — reforço interno PAYPAL
        // ─────────────────────────────────────────────
        {
            id: 'tx-paypal-2',
            type: 'income',
            amount: 300.0,
            from: 'outside',
            date: '2025-10-02',
            description: 'Depósito externo internacional',
            notes: 'Transferência recebida em EUR',
            origin_id: null,
            origin_currency_id: null,
            destination_id: 'gid-paypal',
            destination_currency_id: 'curr_eur',
            origin_rate_to_base: 0,
            destination_rate_to_base: 1
        }
    ];

}
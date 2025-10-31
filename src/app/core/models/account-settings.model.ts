import { Currency } from "./currency.model";

export interface AccountSettings {
    color: string,
    currency: Partial<Currency>
}
export interface Currency {
    id: string,
    name: string,
    code: string,
    is_base: boolean,
    rate_to_base: number
}
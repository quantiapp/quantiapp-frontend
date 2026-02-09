export type responseStatus = 'success' | 'error' | 'not-found' | 'unauthorized';

export interface BaseModel{
    id: string
}

export interface HttpResponseContract<T extends BaseModel> {
    status: responseStatus,
    data?: T[]
}
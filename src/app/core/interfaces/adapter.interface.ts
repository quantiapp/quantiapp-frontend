export interface IAdapter<T, K> {
    fromApi(raw: T): K;
}
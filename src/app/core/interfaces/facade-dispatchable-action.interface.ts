export interface FacadeDispatchableAction {
    // method that will be called in resolvers
    action(): void;
    ignoreAction(): boolean;
}
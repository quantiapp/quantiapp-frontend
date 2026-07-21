import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

    private static _logs: WritableSignal<Popup[]> = signal([]);
    private removeTimeOut: any;
    logs: Signal<Popup[]> = PopupService._logs.asReadonly();

    popupColors: PopupColor = {
        success: '#22C55E',
        error: '#EF4444',
        info: '#F1C40F'
    }
    
    popupStatement: PopupStatement = {
        success: 'Operação bem sucedida',
        error: 'Operação mal sucedida',
        info: 'Informação'
    }

    static success(message: string, timeoutInSeconds: number = 2.5): void{
        this.add(message, 'success', timeoutInSeconds)
    }
    
    static error(message: string, timeoutInSeconds: number = 2.5): void{
        this.add(message, 'error', timeoutInSeconds)
    }

    static info(message: string, timeoutInSeconds: number = 2.5): void{
        this.add(message, 'info', timeoutInSeconds)
    }

    static confirm(message: string, onConfirm: () => void, onCancel?: () => void) {
        const identifier = Math.floor(1000 + Math.random() * 9000);

        this.add(
            message,
            'info',
            0,
            identifier,
            [
                {
                    label: 'Cancelar',
                    variant: 'neutral',
                    action: () => {
                        if(onCancel) onCancel();
                        this.remove(identifier)
                    }
                },
                {
                    label: 'Confirmar',
                    variant: 'info',
                    action: () => {
                        onConfirm();
                        this.remove(identifier);
                    }
                }
            ],
            true
        )
    }

    private static add(message: string, status: PopupStatus, timetoutInSeconds: number, id?: number, actions?: PopupAction[], backdrop?: boolean): void{
        const identifier = id ?? Math.floor(1000 + Math.random() * 9000);

        const log = { message, status, identifier: identifier, duration: timetoutInSeconds, actions, backdrop };
        this._logs.update(currentLogs => [log, ...currentLogs] );

        if(timetoutInSeconds && timetoutInSeconds > 0)
            this.scheduleRemoval(log.identifier, timetoutInSeconds);
    }

    private static scheduleRemoval(id: number, timer: number){
        setTimeout(() => {
            this.remove(id)
        }, timer * 1000);
    }

    static remove(id: number): void {
        this._logs.update(currentLogs => currentLogs.filter(log => log.identifier !== id))
    }

}

export type PopupColor = Record<PopupStatus, string>;
export type PopupStatement = Record<PopupStatus, string>;

export interface Popup{
    message: string,
    status: PopupStatus,
    duration?: number,
    identifier: number,
    actions?: PopupAction[]
    backdrop?: boolean
}

export interface PopupAction {
    label: string,
    variant: PopupActionVariant;
    action: () => void;
}

export type PopupActionVariant = PopupStatus | 'neutral';
export type PopupStatus = 'success' | 'error' | 'info';

import { inject, Injectable, effect, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectionService } from './connection.service';
import { FinanceStore } from '@core/data/finance-store.data';
import { environment } from 'environments/environment';
import { PopupService } from './pop-up.service';

export interface QueuedRequest {
  id: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  uri: string;
  body: any;
  tempId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {
  private http = inject(HttpClient);
  private connectionService = inject(ConnectionService);
  private financeStore = inject(FinanceStore);

  private readonly QUEUE_KEY = 'quantia_offline_queue';
  private isProcessing = false;

  constructor() {
    effect(() => {
      const offline = this.connectionService.isOffline();
      if (!offline) {
        untracked(() => {
          this.processQueue();
        });
      }
    });
  }

  getQueue(): QueuedRequest[] {
    try {
      const data = localStorage.getItem(this.QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: QueuedRequest[]) {
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
  }

  queueRequest(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', uri: string, body: any, tempId?: string) {
    const queue = this.getQueue();
    const newReq: QueuedRequest = {
      id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      method,
      uri,
      body,
      tempId
    };
    queue.push(newReq);
    this.saveQueue(queue);
    console.log(`Pedido offline enfileirado: ${method} ${uri}`, newReq);
  }

  private removeFromQueue(id: string) {
    const queue = this.getQueue();
    const filtered = queue.filter(req => req.id !== id);
    this.saveQueue(filtered);
  }

  private updateRemainingQueueIds(tempId: string, realId: string) {
    const queue = this.getQueue();
    const updated = queue.map(req => {
      if (req.body) {
        let str = JSON.stringify(req.body);
        str = str.split(tempId).join(realId);
        req.body = JSON.parse(str);
      }
      if (req.tempId === tempId) {
        req.tempId = realId;
      }
      return req;
    });
    this.saveQueue(updated);
  }

  async processQueue() {
    if (this.isProcessing) return;
    const queue = this.getQueue();
    if (queue.length === 0) return;

    this.isProcessing = true;
    console.log('Iniciando sincronização de dados offline...', queue.length, 'pedidos pendentes.');

    try {
      for (const req of queue) {
        const url = `${environment.server}/${req.uri}`;
        let response: any = null;

        try {
          // Use standard angular HttpClient (bypassing HttpSchema offline intercepts)
          if (req.method === 'POST') {
            response = await this.http.post(url, req.body).toPromise();
          } else if (req.method === 'PUT') {
            response = await this.http.put(url, req.body).toPromise();
          } else if (req.method === 'PATCH') {
            response = await this.http.patch(url, req.body).toPromise();
          } else if (req.method === 'DELETE') {
            response = await this.http.delete(url).toPromise();
          }
        } catch (err) {
          console.error(`Erro ao sincronizar pedido offline (${req.method} ${req.uri}):`, err);
          this.isProcessing = false;
          return;
        }

        const realId = response?.data?.id || response?.id;
        if (req.tempId && realId) {
          this.financeStore.replaceTempId(req.tempId, realId);
          this.updateRemainingQueueIds(req.tempId, realId);
        }

        this.removeFromQueue(req.id);
      }

      PopupService.success('Dados sincronizados com o servidor!');
    } finally {
      this.isProcessing = false;
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);

  constructor() {}

  getNotifications() {
    return this.notifications$.asObservable();
  }

  showSuccess(title: string, message: string, duration: number = 5000) {
    this.addNotification('success', title, message, duration);
  }

  showError(title: string, message: string, duration: number = 8000) {
    this.addNotification('error', title, message, duration);
  }

  showWarning(title: string, message: string, duration: number = 6000) {
    this.addNotification('warning', title, message, duration);
  }

  showInfo(title: string, message: string, duration: number = 5000) {
    this.addNotification('info', title, message, duration);
  }

  private addNotification(type: Notification['type'], title: string, message: string, duration: number) {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      duration
    };

    const current = this.notifications$.value;
    this.notifications$.next([...current, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }
  }

  removeNotification(id: string) {
    const current = this.notifications$.value;
    const filtered = current.filter(n => n.id !== id);
    this.notifications$.next(filtered);
  }

  clearAll() {
    this.notifications$.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
} 
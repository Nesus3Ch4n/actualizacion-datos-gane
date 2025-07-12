import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notifications" 
        class="notification"
        [ngClass]="'notification-' + notification.type"
        (click)="removeNotification(notification.id)">
        
        <div class="notification-icon">
          <span [ngSwitch]="notification.type">
            <span *ngSwitchCase="'success'"></span>
            <span *ngSwitchCase="'error'"></span>
            <span *ngSwitchCase="'warning'"></span>
            <span *ngSwitchDefault></span>
          </span>
        </div>
        
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
        
        <div class="notification-close">
          <span>×</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
    }

    .notification {
      display: flex;
      align-items: flex-start;
      background: white;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: all 0.3s ease;
      border-left: 4px solid #ddd;
      animation: slideIn 0.3s ease-out;
    }

    .notification:hover {
      transform: translateX(-5px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .notification-success {
      border-left-color: #4caf50;
      background: linear-gradient(135deg, #f8fff8, #ffffff);
    }

    .notification-error {
      border-left-color: #f44336;
      background: linear-gradient(135deg, #fff8f8, #ffffff);
    }

    .notification-warning {
      border-left-color: #ff9800;
      background: linear-gradient(135deg, #fffaf8, #ffffff);
    }

    .notification-info {
      border-left-color: #2196f3;
      background: linear-gradient(135deg, #f8faff, #ffffff);
    }

    .notification-icon {
      margin-right: 12px;
      font-size: 18px;
      flex-shrink: 0;
    }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
      color: #333;
    }

    .notification-message {
      font-size: 13px;
      color: #666;
      line-height: 1.4;
    }

    .notification-close {
      margin-left: 12px;
      font-size: 20px;
      color: #999;
      flex-shrink: 0;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .notification-close:hover {
      opacity: 1;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 480px) {
      .notification-container {
        left: 20px;
        right: 20px;
        max-width: none;
      }
    }
  `]
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.getNotifications().subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeNotification(id: string) {
    this.notificationService.removeNotification(id);
  }
} 
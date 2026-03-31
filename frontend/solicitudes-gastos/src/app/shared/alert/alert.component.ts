import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, AlertPayload } from '../../core/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  alert: AlertPayload = { message: null, type: 'info' };

  constructor(private alertService: AlertService) {
    this.alertService.alert$.subscribe(a => this.alert = a);
  }

  dismiss() { this.alertService.clear(); }
}

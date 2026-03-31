import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/alert/alert.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { ConfirmComponent } from './shared/confirm/confirm.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent, LoadingComponent, ConfirmComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('solicitudes-gastos');
}

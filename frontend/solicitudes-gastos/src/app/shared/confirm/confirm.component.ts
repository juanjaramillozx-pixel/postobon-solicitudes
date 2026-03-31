import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from './confirm.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {
  message: string | null = null;
  @ViewChild('acceptBtn') acceptBtn?: ElementRef<HTMLButtonElement>;

  constructor(private confirm: ConfirmService) {
    this.confirm.message$.subscribe(m => {
      this.message = m;
      // move focus to accept button when dialog appears
      setTimeout(() => this.acceptBtn?.nativeElement.focus(), 0);
    });
  }

  accept() { this.confirm.resolve(true); }
  cancel() { this.confirm.resolve(false); }

  @HostListener('document:keydown', ['$event'])
  onEscape(e: KeyboardEvent) { if (this.message && e.key === 'Escape') this.cancel(); }
}

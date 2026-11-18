import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class App {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected odjavi(): void {
    this.authService.odjavi();
    this.router.navigate(['/auth/prijava']);
  }
}

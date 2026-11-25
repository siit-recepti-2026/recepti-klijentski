import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotifikacijeService, SistemskaNotifikacija } from './notifikacije.service';

@Component({
  selector: 'app-notifikacije',
  standalone: false,
  styleUrl: './notifikacije.scss',
  templateUrl: './notifikacije.html',
})
export class Notifikacije implements OnInit {
  private readonly service = inject(NotifikacijeService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly notifikacije = signal<SistemskaNotifikacija[] | null>(null);
  protected readonly greska = signal(false);

  ngOnInit(): void {
    this.ucitaj();
  }

  protected ucitaj(): void {
    this.greska.set(false);
    this.service.moje().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (notifikacije) => this.notifikacije.set(notifikacije),
      error: () => this.greska.set(true),
    });
  }
}

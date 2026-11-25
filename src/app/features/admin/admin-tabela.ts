import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  ViewChild,
  inject,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { filter, finalize, switchMap } from 'rxjs';

import {
  DijalogPotvrde,
  PodaciDijalogaPotvrde,
} from '../../shared/dijalog-potvrde/dijalog-potvrde';
import { AdminPregledService, StavkaPregleda, VrstaListe } from './admin-pregled.service';

function paginatorNaSrpskom(): MatPaginatorIntl {
  const paginator = new MatPaginatorIntl();
  paginator.itemsPerPageLabel = 'Stavki po strani';
  paginator.nextPageLabel = 'Sledeća strana';
  paginator.previousPageLabel = 'Prethodna strana';
  paginator.getRangeLabel = (strana, velicina, ukupno) => {
    if (!ukupno) {
      return '0 od 0';
    }

    return `${strana * velicina + 1}–${Math.min((strana + 1) * velicina, ukupno)} od ${ukupno}`;
  };
  return paginator;
}

@Component({
  selector: 'app-admin-tabela',
  standalone: false,
  templateUrl: './admin-tabela.html',
  providers: [{ provide: MatPaginatorIntl, useFactory: paginatorNaSrpskom }],
  styles: ['mat-form-field { margin-top: 1rem; width: min(100%, 24rem); }'],
})
export class AdminTabela implements AfterViewInit {
  private readonly service = inject(AdminPregledService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  @Input() vrsta: VrstaListe | null = null;
  readonly izmeni = output<StavkaPregleda>();
  readonly deaktivirano = output<StavkaPregleda>();
  protected readonly deaktiviranje = signal(false);
  protected readonly greskaDeaktivacije = signal('');
  protected readonly porukaDeaktivacije = signal('');

  @Input({ required: true }) set stavke(stavke: StavkaPregleda[]) {
    this.izvor.data = stavke;
  }

  @Input() prikaziOpis = false;
  @ViewChild(MatSort) private sort!: MatSort;
  @ViewChild(MatPaginator) private paginator!: MatPaginator;

  protected readonly izvor = new MatTableDataSource<StavkaPregleda>();

  protected get kolone(): string[] {
    const kolone = this.prikaziOpis ? ['naziv', 'opis', 'aktivan'] : ['naziv', 'aktivan'];
    return this.vrsta ? [...kolone, 'akcije'] : kolone;
  }

  constructor() {
    this.izvor.filterPredicate = (stavka, upit) => {
      const tekst = [stavka.naziv, stavka.opis, stavka.aktivan ? 'Aktivno' : 'Neaktivno']
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('sr-Latn');

      return tekst.includes(upit);
    };
  }

  ngAfterViewInit(): void {
    this.izvor.sort = this.sort;
    this.izvor.paginator = this.paginator;
  }

  protected pretrazi(upit: string): void {
    this.izvor.filter = upit.trim().toLocaleLowerCase('sr-Latn');
    this.paginator.firstPage();
  }
  protected traziPotvrdu(stavka: StavkaPregleda): void {
    const vrsta = this.vrsta;
    if (!vrsta || this.deaktiviranje()) {
      return;
    }

    this.greskaDeaktivacije.set('');
    this.porukaDeaktivacije.set('');
    this.deaktiviranje.set(true);
    this.dialog
      .open<DijalogPotvrde, PodaciDijalogaPotvrde, boolean>(DijalogPotvrde, {
        data: {
          naslov: 'Deaktivacija stavke',
          poruka: `Deaktivirati „${stavka.naziv}“?`,
          tekstPotvrde: 'Deaktiviraj',
        },
      })
      .afterClosed()
      .pipe(
        filter((potvrdjeno) => potvrdjeno === true),
        switchMap(() => this.service.deaktiviraj(vrsta, stavka.id)),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.deaktiviranje.set(false)),
      )
      .subscribe({
        next: (deaktiviranaStavka) => {
          this.deaktivirano.emit(deaktiviranaStavka);
          this.porukaDeaktivacije.set('Stavka je deaktivirana.');
        },
        error: (greska: HttpErrorResponse) => {
          if (greska.status === 409) {
            this.greskaDeaktivacije.set('Stavka je u upotrebi i ne može da se deaktivira.');
          } else if (greska.status === 401 || greska.status === 403) {
            this.greskaDeaktivacije.set('Deaktivacija je dostupna prijavljenom administratoru.');
          } else {
            this.greskaDeaktivacije.set(
              'Deaktivacija nije uspela. Osveži stranicu i pokušaj ponovo.',
            );
          }
        },
      });
  }
}

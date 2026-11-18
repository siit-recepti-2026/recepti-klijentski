import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { StavkaPregleda } from './admin-pregled.service';

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
  @Input({ required: true }) set stavke(stavke: StavkaPregleda[]) {
    this.izvor.data = stavke;
  }

  @Input() prikaziOpis = false;
  @ViewChild(MatSort) private sort!: MatSort;
  @ViewChild(MatPaginator) private paginator!: MatPaginator;

  protected readonly izvor = new MatTableDataSource<StavkaPregleda>();

  protected get kolone(): string[] {
    return this.prikaziOpis ? ['naziv', 'opis', 'aktivan'] : ['naziv', 'aktivan'];
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
}

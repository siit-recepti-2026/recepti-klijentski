import { Component, computed, input, signal } from '@angular/core';
import { ReceptKarticaOdgovor } from '../../core/models/recept.models';
import { environment } from '../../../environments/environment';

//Slike se sluze sa servera (npr. http://localhost:8080/slike/sarma.jpg), a u bazi je samo putanja
const ADRESA_SERVERA = environment.apiUrl.replace(/\/api$/, '');

//Kartica sa osnovnim informacijama o receptu; klik vodi na stranicu recepta
@Component({
  selector: 'app-kartica-recepta',
  standalone: false,
  templateUrl: './kartica-recepta.html',
  styleUrl: './kartica-recepta.scss',
})
export class KarticaRecepta {
  readonly recept = input.required<ReceptKarticaOdgovor>();

  protected readonly slikaNijeUcitana = signal(false);

  protected readonly slika = computed(() => ADRESA_SERVERA + this.recept().glavnaFotografija);

  protected readonly tipovi = computed(() => {
    const r = this.recept();
    return [r.tipJela, ...r.tipoviObroka, ...r.tipoviIshrane].join(' · ');
  });

  protected readonly ocena = computed(() => {
    const r = this.recept();
    if (r.brojOcena === 0) {
      return 'Bez ocena';
    }
    return `${r.prosecnaOcena.toFixed(1).replace('.', ',')} (${r.brojOcena})`;
  });

  protected readonly vreme = computed(() => {
    const minuti = this.recept().ukupnoVremePripremeMin;
    const sati = Math.floor(minuti / 60);
    const ostatak = minuti % 60;
    if (sati === 0) {
      return `${ostatak} min`;
    }
    return ostatak === 0 ? `${sati} h` : `${sati} h ${ostatak} min`;
  });

  protected readonly porcije = computed(() => {
    const broj = this.recept().brojPorcija;
    const poslednjaCifra = broj % 10;
    const poslednjeDve = broj % 100;
    const rec =
      poslednjaCifra >= 2 && poslednjaCifra <= 4 && (poslednjeDve < 12 || poslednjeDve > 14)
        ? 'porcije'
        : 'porcija';
    return `${broj} ${rec}`;
  });
}

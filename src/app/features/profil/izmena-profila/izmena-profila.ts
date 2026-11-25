import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, map, of, switchMap } from 'rxjs';
import { GRUPE_REGIONA, Region } from '../../../core/data/regioni';
import { LokacijaOdgovor, ProfilOdgovor } from '../../../core/models/profil.models';
import { ProfilService } from '../../../core/services/profil.service';
import { ADRESA_SERVERA, SlikaService } from '../../../core/services/slika.service';
import { primeniGreskeServera } from '../../auth/greske-servera';

export const MAX_BIOGRAFIJA = 1000;

//Forma za izmenu svog profila: profilna slika, biografija i region. Korisnicko ime se samo prikazuje.
@Component({
  selector: 'app-izmena-profila',
  standalone: false,
  templateUrl: './izmena-profila.html',
  styleUrl: './izmena-profila.scss',
})
export class IzmenaProfila implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly profilService = inject(ProfilService);
  private readonly slikaService = inject(SlikaService);

  readonly profil = input.required<ProfilOdgovor>();
  readonly sacuvano = output<ProfilOdgovor>();
  readonly otkazano = output<void>();

  protected readonly grupeRegiona = GRUPE_REGIONA;
  protected readonly maxBiografija = MAX_BIOGRAFIJA;
  protected readonly salje = signal(false);
  protected readonly greska = signal<string | null>(null);
  protected readonly greskaSlike = signal<string | null>(null);

  //Nova slika se otprema tek na "Sacuvaj", a do tada se prikazuje samo pregled iz browsera
  private readonly novaSlika = signal<File | null>(null);
  protected readonly pregledNoveSlike = signal<string | null>(null);
  protected readonly ukloniSliku = signal(false);

  protected readonly forma = this.fb.nonNullable.group({
    biografija: ['', [Validators.maxLength(MAX_BIOGRAFIJA)]],
    region: this.fb.control<Region | null>(null, Validators.required),
  });

  protected readonly prikazSlike = computed(() => {
    if (this.pregledNoveSlike()) {
      return this.pregledNoveSlike();
    }
    const trenutna = this.profil().profilnaSlika;
    return trenutna && !this.ukloniSliku() ? ADRESA_SERVERA + trenutna : null;
  });

  protected readonly inicijal = computed(() => this.profil().korisnickoIme.charAt(0).toUpperCase());

  ngOnInit(): void {
    const profil = this.profil();
    this.forma.setValue({
      biografija: profil.biografija ?? '',
      region: this.pronadjiRegion(profil.region),
    });
  }

  ngOnDestroy(): void {
    this.oslobodiPregled();
  }

  protected izaberiSliku(dogadjaj: Event): void {
    const polje = dogadjaj.target as HTMLInputElement;
    const fajl = polje.files?.[0];
    //Isti fajl moze ponovo da se izabere posle greske
    polje.value = '';
    if (!fajl) {
      return;
    }
    const greska = this.slikaService.greskaZaFajl(fajl);
    this.greskaSlike.set(greska);
    if (greska) {
      return;
    }
    this.oslobodiPregled();
    this.novaSlika.set(fajl);
    this.pregledNoveSlike.set(URL.createObjectURL(fajl));
    this.ukloniSliku.set(false);
  }

  protected ukloni(): void {
    this.oslobodiPregled();
    this.novaSlika.set(null);
    this.greskaSlike.set(null);
    this.ukloniSliku.set(true);
  }

  protected sacuvaj(): void {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    const { biografija, region } = this.forma.getRawValue();
    this.salje.set(true);
    this.greska.set(null);

    //Prvo se otprema nova slika (ako je izabrana), pa se njen id salje uz ostale podatke
    const fajl = this.novaSlika();
    const idSlike$: Observable<number | undefined> = fajl
      ? this.slikaService.otpremi(fajl).pipe(map((slika) => slika.id))
      : of(undefined);

    idSlike$
      .pipe(
        switchMap((profilnaSlikaId) =>
          this.profilService.izmeni({
            biografija: biografija.trim() || null,
            region: region!.lokacija,
            profilnaSlikaId,
            ukloniProfilnuSliku: this.ukloniSliku() && !profilnaSlikaId,
          }),
        ),
      )
      .subscribe({
        next: (profil) => {
          this.salje.set(false);
          this.sacuvano.emit(profil);
        },
        error: (greska: HttpErrorResponse) => {
          this.salje.set(false);
          this.greska.set(primeniGreskeServera(this.forma, greska));
        },
      });
  }

  //Trenutni region korisnika iz liste regiona (ista lista kao pri registraciji)
  private pronadjiRegion(lokacija: LokacijaOdgovor): Region | null {
    for (const grupa of GRUPE_REGIONA) {
      const nadjen = grupa.regioni.find(
        (r) =>
          r.lokacija.drzava === lokacija.drzava &&
          (r.lokacija.region ?? null) === (lokacija.region ?? null),
      );
      if (nadjen) {
        return nadjen;
      }
    }
    return null;
  }

  private oslobodiPregled(): void {
    const pregled = this.pregledNoveSlike();
    if (pregled) {
      URL.revokeObjectURL(pregled);
      this.pregledNoveSlike.set(null);
    }
  }
}

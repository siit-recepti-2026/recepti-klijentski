import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { NotifikacijeModule } from './notifikacije.module';
import { Notifikacije } from './notifikacije';

describe('Notifikacije', () => {
  let fixture: ComponentFixture<Notifikacije>;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/notifikacije`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifikacijeModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Notifikacije);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('prikazuje naslove, poruke i vreme redom kako je server vratio', () => {
    http.expectOne({ url, method: 'GET' }).flush([
      { id: 2, naslov: 'Novija', poruka: 'Nova poruka', vremeKreiranja: '2026-11-20T14:00:00' },
      { id: 1, naslov: 'Ranija', poruka: 'Stara poruka', vremeKreiranja: '2026-11-20T09:00:00' },
    ]);
    fixture.detectChanges();

    const stranica: HTMLElement = fixture.nativeElement;
    expect(Array.from(stranica.querySelectorAll('li h2'), (h) => h.textContent)).toEqual([
      'Novija', 'Ranija',
    ]);
    expect(stranica.querySelector('li p')?.textContent).toBe('Nova poruka');
    expect(stranica.querySelector('time')?.getAttribute('datetime')).toBe('2026-11-20T14:00:00');
    expect(stranica.querySelector('time')?.textContent).toContain('20.11.2026. 14:00');
  });

  it('prikazuje praznu listu posle uspešnog ponovnog učitavanja', () => {
    http.expectOne(url).flush(null, { status: 503, statusText: 'Unavailable' });
    fixture.detectChanges();

    const stranica: HTMLElement = fixture.nativeElement;
    expect(stranica.querySelector('[role="alert"]')?.textContent).toContain('ne mogu da se učitaju');
    stranica.querySelector('button')?.click();
    http.expectOne(url).flush([]);
    fixture.detectChanges();

    expect(stranica.textContent).toContain('Nema sistemskih notifikacija.');
    expect(stranica.querySelector('[role="alert"]')).toBeNull();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { Pocetna } from './pocetna';
import { PocetnaModule } from './pocetna.module';

describe('Pocetna', () => {
  let component: Pocetna;
  let fixture: ComponentFixture<Pocetna>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PocetnaModule, RouterModule.forRoot([])],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Pocetna);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

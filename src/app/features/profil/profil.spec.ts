import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { Profil } from './profil';
import { ProfilModule } from './profil.module';

describe('Profil', () => {
  let component: Profil;
  let fixture: ComponentFixture<Profil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilModule, RouterModule.forRoot([])],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Profil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

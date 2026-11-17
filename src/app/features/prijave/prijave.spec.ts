import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Prijave } from './prijave';

describe('Prijave', () => {
  let component: Prijave;
  let fixture: ComponentFixture<Prijave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Prijave],
    }).compileComponents();

    fixture = TestBed.createComponent(Prijave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

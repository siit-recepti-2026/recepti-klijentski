import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Evidencija } from './evidencija';

describe('Evidencija', () => {
  let component: Evidencija;
  let fixture: ComponentFixture<Evidencija>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Evidencija],
    }).compileComponents();

    fixture = TestBed.createComponent(Evidencija);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

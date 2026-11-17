import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Recepti } from './recepti';

describe('Recepti', () => {
  let component: Recepti;
  let fixture: ComponentFixture<Recepti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Recepti],
    }).compileComponents();

    fixture = TestBed.createComponent(Recepti);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

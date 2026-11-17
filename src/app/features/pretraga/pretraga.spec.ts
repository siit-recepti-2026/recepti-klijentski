import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pretraga } from './pretraga';

describe('Pretraga', () => {
  let component: Pretraga;
  let fixture: ComponentFixture<Pretraga>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Pretraga],
    }).compileComponents();

    fixture = TestBed.createComponent(Pretraga);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

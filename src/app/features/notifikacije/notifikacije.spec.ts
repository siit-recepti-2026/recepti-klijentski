import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notifikacije } from './notifikacije';

describe('Notifikacije', () => {
  let component: Notifikacije;
  let fixture: ComponentFixture<Notifikacije>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Notifikacije],
    }).compileComponents();

    fixture = TestBed.createComponent(Notifikacije);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Nasa } from './nasa';

describe('Nasa', () => {
  let component: Nasa;
  let fixture: ComponentFixture<Nasa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nasa],
    }).compileComponents();

    fixture = TestBed.createComponent(Nasa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Gatti } from './gatti';

describe('Gatti', () => {
  let component: Gatti;
  let fixture: ComponentFixture<Gatti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gatti],
    }).compileComponents();

    fixture = TestBed.createComponent(Gatti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

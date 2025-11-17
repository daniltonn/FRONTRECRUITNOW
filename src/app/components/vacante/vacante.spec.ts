import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vacante } from './vacante';

describe('Vacante', () => {
  let component: Vacante;
  let fixture: ComponentFixture<Vacante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vacante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vacante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

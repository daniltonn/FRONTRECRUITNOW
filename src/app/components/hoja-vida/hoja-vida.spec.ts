import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HojaVidaComponent } from './hoja-vida';
import { HojaVidaService } from '../../services/hoja-vida-service';

describe('HojaVidaComponent', () => {
  let component: HojaVidaComponent;
  let fixture: ComponentFixture<HojaVidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HojaVidaComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [HojaVidaService]
    }).compileComponents();

    fixture = TestBed.createComponent(HojaVidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.form).toBeDefined();
    expect(component.form.get('datosPersonales')).toBeDefined();
    expect(component.form.get('experienciaLaboral')).toBeDefined();
  });

  it('should add experience when agregarExperiencia is called', () => {
    const initialLength = component.experienciaLaboral.length;
    component.agregarExperiencia();
    expect(component.experienciaLaboral.length).toBe(initialLength + 1);
  });

  it('should add education when agregarEducacion is called', () => {
    const initialLength = component.educacion.length;
    component.agregarEducacion();
    expect(component.educacion.length).toBe(initialLength + 1);
  });

  it('should show form when mostrarFormulario is called', () => {
    component.mostrarFormulario();
    expect(component.showForm).toBe(true);
    expect(component.editMode).toBe(false);
  });

  it('should hide form when ocultarFormulario is called', () => {
    component.showForm = true;
    component.ocultarFormulario();
    expect(component.showForm).toBe(false);
    expect(component.editMode).toBe(false);
  });
});
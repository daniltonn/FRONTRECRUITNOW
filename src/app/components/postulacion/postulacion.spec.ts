import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PostulacionComponent } from './postulacion';
import { PostulacionService } from '../../services/postulacion-service';

describe('PostulacionComponent', () => {
  let component: PostulacionComponent;
  let fixture: ComponentFixture<PostulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostulacionComponent,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [PostulacionService]
    }).compileComponents();

    fixture = TestBed.createComponent(PostulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    component.ngOnInit();
    expect(component.form).toBeDefined();
    expect(component.entrevistaForm).toBeDefined();
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

  it('should show interview modal when mostrarModalEntrevista is called', () => {
    const mockPostulacion = {
      _id: '1',
      usuarioId: 'user1',
      vacanteId: 'job1',
      hojaVidaId: 'cv1',
      estado: 'PENDIENTE' as any,
      fechaPostulacion: new Date(),
      disponibilidad: {
        fechaInicioDisponible: new Date(),
        modalidadTrabajo: [],
        horarioPreferido: 'TIEMPO_COMPLETO' as any,
        disponibilidadViajes: false,
        disponibilidadCambioResidencia: false
      }
    };
    
    component.mostrarModalEntrevista(mockPostulacion);
    expect(component.showEntrevistaModal).toBe(true);
    expect(component.selectedPostulacion).toBe(mockPostulacion);
  });

  it('should hide interview modal when ocultarModalEntrevista is called', () => {
    component.showEntrevistaModal = true;
    component.ocultarModalEntrevista();
    expect(component.showEntrevistaModal).toBe(false);
    expect(component.selectedPostulacion).toBe(null);
  });
});
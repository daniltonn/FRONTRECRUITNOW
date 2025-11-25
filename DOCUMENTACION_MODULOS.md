# 📚 Documentación Técnica - Módulos RecruitNow

## 🎯 Índice
1. [Arquitectura General](#arquitectura-general)
2. [Módulo Hoja de Vida](#módulo-hoja-de-vida)
3. [Módulo Postulaciones](#módulo-postulaciones)
4. [Conceptos Angular Utilizados](#conceptos-angular-utilizados)
5. [Patrones de Diseño](#patrones-de-diseño)
6. [Estructura de Archivos](#estructura-de-archivos)

---

## 🏗️ Arquitectura General

### Patrón de Arquitectura
La aplicación sigue el patrón **MVC (Model-View-Controller)** adaptado para Angular:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     MODELS      │    │   COMPONENTS    │    │    SERVICES     │
│   (Interfaces)  │◄──►│   (Controllers) │◄──►│   (Data Layer)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Flujo de Datos
1. **Component** → Maneja la lógica de presentación y eventos del usuario
2. **Service** → Gestiona las llamadas HTTP y lógica de negocio
3. **Model** → Define la estructura de datos con TypeScript

---

## 📄 Módulo Hoja de Vida

### 🎯 Propósito
Gestionar currículums vitae completos con información personal, experiencia laboral, educación, habilidades, idiomas y referencias.

### 📁 Estructura de Archivos
```
src/app/components/hoja-vida/
├── hoja-vida.ts          # Lógica del componente
├── hoja-vida.html        # Template/Vista
├── hoja-vida.css         # Estilos
└── hoja-vida.spec.ts     # Pruebas unitarias

src/app/models/
└── hoja-vida.ts          # Interfaces y tipos

src/app/services/
├── hoja-vida-service.ts      # Servicio HTTP
└── hoja-vida-service.spec.ts # Pruebas del servicio
```

### 🔧 Componente Principal (`hoja-vida.ts`)

#### Decorador @Component
```typescript
@Component({
  standalone: true,                    // Componente independiente (Angular 14+)
  selector: 'app-hoja-vida',          // Selector HTML
  templateUrl: './hoja-vida.html',    // Archivo de template
  styleUrls: ['./hoja-vida.css'],     // Archivo de estilos
  imports: [CommonModule, ReactiveFormsModule] // Módulos necesarios
})
```

#### Formularios Reactivos
```typescript
// FormBuilder para crear formularios complejos
this.form = this.fb.group({
  datosPersonales: this.fb.group({     // FormGroup anidado
    nombre: ['', Validators.required], // FormControl con validación
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  }),
  experienciaLaboral: this.fb.array([]), // FormArray para elementos dinámicos
  educacion: this.fb.array([]),
  habilidades: this.fb.array([])
});
```

#### Gestión de FormArrays
```typescript
// Getter para acceder al FormArray
get experienciaLaboral() {
  return this.form.get('experienciaLaboral') as FormArray;
}

// Agregar nueva experiencia
agregarExperiencia() {
  const experienciaForm = this.fb.group({
    empresa: ['', Validators.required],
    cargo: ['', Validators.required],
    fechaInicio: ['', Validators.required]
  });
  this.experienciaLaboral.push(experienciaForm);
}

// Eliminar experiencia
eliminarExperiencia(index: number) {
  this.experienciaLaboral.removeAt(index);
}
```

### 🌐 Servicio HTTP (`hoja-vida-service.ts`)

#### Inyección de Dependencias
```typescript
@Injectable({
  providedIn: 'root'  // Singleton a nivel de aplicación
})
export class HojaVidaService {
  constructor(private http: HttpClient) { }
}
```

#### Operaciones CRUD
```typescript
// GET - Obtener todas las hojas de vida
getAll(): Observable<HojaVida[]> {
  return this.http.get<HojaVida[]>(this.apiUrl);
}

// POST - Crear nueva hoja de vida
create(hojaVida: HojaVida): Observable<HojaVida> {
  return this.http.post<HojaVida>(this.apiUrl, hojaVida);
}

// PUT - Actualizar hoja de vida
update(id: string, hojaVida: HojaVida): Observable<HojaVida> {
  return this.http.put<HojaVida>(`${this.apiUrl}/${id}`, hojaVida);
}
```

### 📊 Modelos TypeScript (`hoja-vida.ts`)

#### Interfaces Principales
```typescript
export interface HojaVida {
  _id?: string;                    // ID opcional (MongoDB)
  usuarioId: string;               // Relación con usuario
  datosPersonales: DatosPersonales; // Objeto anidado
  experienciaLaboral: ExperienciaLaboral[]; // Array de objetos
  educacion: Educacion[];
  habilidades: string[];           // Array simple
  idiomas: Idioma[];
  referencias: Referencia[];
}

export interface ExperienciaLaboral {
  empresa: string;
  cargo: string;
  fechaInicio: Date;
  fechaFin?: Date;                 // Opcional
  descripcion: string;
  esTrabajoActual: boolean;
}
```

---

## 🎯 Módulo Postulaciones

### 🎯 Propósito
Gestionar el proceso completo de postulaciones, desde la aplicación inicial hasta la contratación, incluyendo entrevistas y seguimiento.

### 🔧 Características Avanzadas

#### Enums para Estados
```typescript
export enum EstadoPostulacion {
  PENDIENTE = 'PENDIENTE',
  EN_REVISION = 'EN_REVISION',
  PRESELECCIONADO = 'PRESELECCIONADO',
  ENTREVISTA_PROGRAMADA = 'ENTREVISTA_PROGRAMADA',
  CONTRATADO = 'CONTRATADO',
  RECHAZADO = 'RECHAZADO'
}
```

#### Gestión de Estados Dinámicos
```typescript
// Método para obtener clase CSS según estado
getEstadoClass(estado: EstadoPostulacion): string {
  const clases: { [key in EstadoPostulacion]: string } = {
    [EstadoPostulacion.PENDIENTE]: 'badge-warning',
    [EstadoPostulacion.CONTRATADO]: 'badge-success',
    [EstadoPostulacion.RECHAZADO]: 'badge-danger'
  };
  return clases[estado] || 'badge-secondary';
}
```

#### Modal de Entrevistas
```typescript
// Control de modal con estado local
showEntrevistaModal = false;
selectedPostulacion: PostulacionConDetalles | null = null;

mostrarModalEntrevista(postulacion: PostulacionConDetalles) {
  this.selectedPostulacion = postulacion;
  this.showEntrevistaModal = true;
  this.entrevistaForm.reset();
}
```

### 🔍 Filtros y Búsqueda Avanzada

#### Filtros Dinámicos
```typescript
filtrarPostulaciones(filtros: {
  estado?: EstadoPostulacion;
  vacanteId?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}): Observable<PostulacionConDetalles[]> {
  let params = new HttpParams();
  
  Object.keys(filtros).forEach(key => {
    const value = (filtros as any)[key];
    if (value !== undefined && value !== null) {
      params = params.set(key, value.toString());
    }
  });

  return this.http.get<PostulacionConDetalles[]>(`${this.apiUrl}/filtrar`, { params });
}
```

---

## ⚡ Conceptos Angular Utilizados

### 1. **Standalone Components** (Angular 14+)
```typescript
@Component({
  standalone: true,  // No necesita NgModule
  imports: [CommonModule, ReactiveFormsModule] // Importaciones directas
})
```

**Ventajas:**
- Menos boilerplate code
- Mejor tree-shaking
- Carga más rápida

### 2. **Reactive Forms**
```typescript
// FormBuilder para formularios complejos
this.form = this.fb.group({
  campo: ['valor inicial', [Validators.required, Validators.email]]
});
```

**Ventajas:**
- Validación robusta
- Mejor control del estado
- Fácil testing

### 3. **Dependency Injection**
```typescript
constructor(
  private api: HojaVidaService,  // Servicio inyectado
  private fb: FormBuilder        // FormBuilder inyectado
) { }
```

### 4. **Observables y RxJS**
```typescript
// Patrón Observable para operaciones asíncronas
this.api.getAll().subscribe((data: HojaVida[]) => {
  this.hojasVida = data;
});
```

### 5. **Two-Way Data Binding**
```html
<!-- ngModel para binding bidireccional -->
<input [(ngModel)]="terminoBusqueda" (keyup.enter)="buscar()">
```

### 6. **Structural Directives**
```html
<!-- *ngFor para listas -->
<tr *ngFor="let postulacion of postulaciones; let i = index">

<!-- *ngIf para condicionales -->
<div *ngIf="showForm">

<!-- *ngFor con trackBy para performance -->
<div *ngFor="let item of items; trackBy: trackByFn">
```

### 7. **Event Binding**
```html
<!-- Eventos del DOM -->
<button (click)="guardar()">Guardar</button>
<form (ngSubmit)="onSubmit()">
```

### 8. **Property Binding**
```html
<!-- Binding de propiedades -->
<input [disabled]="form.invalid">
<div [class.active]="isActive">
```

---

## 🎨 Patrones de Diseño Implementados

### 1. **Repository Pattern**
```typescript
// Servicio actúa como repositorio
export class HojaVidaService {
  getAll(): Observable<HojaVida[]> { }
  get(id: string): Observable<HojaVida> { }
  create(item: HojaVida): Observable<HojaVida> { }
  update(id: string, item: HojaVida): Observable<HojaVida> { }
  delete(id: string): Observable<any> { }
}
```

### 2. **Observer Pattern**
```typescript
// Observables para comunicación asíncrona
this.api.create(hojaVida).subscribe({
  next: (result) => console.log('Éxito', result),
  error: (error) => console.error('Error', error),
  complete: () => console.log('Completado')
});
```

### 3. **Factory Pattern**
```typescript
// FormBuilder como factory de formularios
createForm(): FormGroup {
  return this.fb.group({
    // configuración del formulario
  });
}
```

### 4. **Strategy Pattern**
```typescript
// Diferentes estrategias según el estado
getEstadoClass(estado: EstadoPostulacion): string {
  const strategies = {
    [EstadoPostulacion.PENDIENTE]: () => 'badge-warning',
    [EstadoPostulacion.CONTRATADO]: () => 'badge-success'
  };
  return strategies[estado]?.() || 'badge-secondary';
}
```

---

## 🗂️ Estructura de Archivos Detallada

```
FRONTRECRUITNOW/
├── src/
│   ├── app/
│   │   ├── components/           # Componentes de la aplicación
│   │   │   ├── hoja-vida/       # Módulo Hoja de Vida
│   │   │   │   ├── hoja-vida.ts
│   │   │   │   ├── hoja-vida.html
│   │   │   │   ├── hoja-vida.css
│   │   │   │   └── hoja-vida.spec.ts
│   │   │   ├── postulacion/     # Módulo Postulaciones
│   │   │   │   ├── postulacion.ts
│   │   │   │   ├── postulacion.html
│   │   │   │   ├── postulacion.css
│   │   │   │   └── postulacion.spec.ts
│   │   │   ├── layout/          # Layout principal
│   │   │   ├── dashboard/       # Dashboard
│   │   │   ├── usuario/         # Gestión usuarios
│   │   │   └── vacante/         # Gestión vacantes
│   │   ├── services/            # Servicios HTTP
│   │   │   ├── hoja-vida-service.ts
│   │   │   ├── postulacion-service.ts
│   │   │   ├── usuario-service.ts
│   │   │   └── vacante-service.ts
│   │   ├── models/              # Interfaces TypeScript
│   │   │   ├── hoja-vida.ts
│   │   │   ├── postulacion.ts
│   │   │   └── user.ts
│   │   ├── guards/              # Guards de autenticación
│   │   ├── interceptors/        # Interceptores HTTP
│   │   ├── app.routes.ts        # Configuración de rutas
│   │   └── app.config.ts        # Configuración de la app
│   ├── assets/                  # Recursos estáticos
│   └── styles.css              # Estilos globales
└── package.json                # Dependencias del proyecto
```

---

## 🚀 Flujo de Ejecución

### 1. **Inicialización de la Aplicación**
```
main.ts → app.config.ts → app.routes.ts → LayoutComponent
```

### 2. **Navegación a Módulo**
```
Usuario hace clic → Router → Componente → ngOnInit() → Cargar datos
```

### 3. **Operación CRUD**
```
Usuario interactúa → Evento → Método del componente → Servicio → HTTP → Backend
```

### 4. **Actualización de Vista**
```
Respuesta HTTP → Observable → subscribe() → Actualizar datos → Change Detection
```

---

## 🔧 Comandos de Desarrollo

### Ejecutar la aplicación
```bash
cd FRONTRECRUITNOW
npm start
# o
ng serve --proxy-config proxy.conf.json
```

### Ejecutar pruebas
```bash
ng test
```

### Compilar para producción
```bash
ng build --prod
```

---

## 📈 Mejores Prácticas Implementadas

### 1. **Separación de Responsabilidades**
- **Componentes**: Solo lógica de presentación
- **Servicios**: Lógica de negocio y HTTP
- **Modelos**: Definición de tipos

### 2. **Tipado Fuerte con TypeScript**
```typescript
// Interfaces bien definidas
interface HojaVida {
  _id?: string;
  usuarioId: string;
  datosPersonales: DatosPersonales;
}

// Enums para valores constantes
enum EstadoPostulacion {
  PENDIENTE = 'PENDIENTE',
  CONTRATADO = 'CONTRATADO'
}
```

### 3. **Manejo de Errores**
```typescript
this.api.create(data).subscribe({
  next: (result) => this.handleSuccess(result),
  error: (error) => this.handleError(error)
});
```

### 4. **Validaciones Robustas**
```typescript
// Validaciones síncronas y asíncronas
nombre: ['', [Validators.required, Validators.minLength(2)]],
email: ['', [Validators.required, Validators.email]]
```

### 5. **Código Reutilizable**
```typescript
// Métodos utilitarios
formatearFecha(fecha: Date | string): string {
  return new Date(fecha).toLocaleDateString('es-ES');
}
```

---

## 🎯 Conclusión

Los módulos implementados siguen las mejores prácticas de Angular y proporcionan:

- ✅ **Escalabilidad**: Arquitectura modular y bien estructurada
- ✅ **Mantenibilidad**: Código limpio y bien documentado
- ✅ **Reutilización**: Componentes y servicios reutilizables
- ✅ **Performance**: Lazy loading y change detection optimizada
- ✅ **Seguridad**: Validaciones y tipado fuerte
- ✅ **UX**: Interfaces responsivas y intuitivas

Esta documentación te ayudará a entender, mantener y extender los módulos desarrollados.
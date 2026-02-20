import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadisticasComponent } from './estadisticas.component';
import { EstadisticasService } from '../../servicios/estadisticas.service';
import { UsuarioGlobalService } from '../../servicios/usuario-global.service';
import { Title } from '@angular/platform-browser';
import { ThemeService } from '../../servicios/theme.service';
import { of } from 'rxjs';

describe('EstadisticasComponent', () => {
  let component: EstadisticasComponent;
  let fixture: ComponentFixture<EstadisticasComponent>;
  let mockEstadisticasService: jasmine.SpyObj<EstadisticasService>;
  let mockUsuarioGlobal: jasmine.SpyObj<UsuarioGlobalService>;
  let mockTitle: jasmine.SpyObj<Title>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    mockEstadisticasService = jasmine.createSpyObj('EstadisticasService', [
      'obtenerResumenEstadisticas',
      'obtenerVideosConMejorRendimiento',
      'obtenerDatosAudiencia',
      'obtenerEngagement',
      'obtenerVistasporPeriodo'
    ]);

    mockUsuarioGlobal = jasmine.createSpyObj('UsuarioGlobalService', [], {
      usuario$: of({ id: 1, nombre: 'Usuario Test' })
    });

    mockTitle = jasmine.createSpyObj('Title', ['setTitle']);
    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      temaActual: 'light',
      temaActual$: of('light')
    });

    await TestBed.configureTestingModule({
      declarations: [EstadisticasComponent],
      providers: [
        { provide: EstadisticasService, useValue: mockEstadisticasService },
        { provide: UsuarioGlobalService, useValue: mockUsuarioGlobal },
        { provide: Title, useValue: mockTitle },
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title on init', () => {
    fixture.detectChanges();
    expect(mockTitle.setTitle).toHaveBeenCalledWith('Estadísticas - Creadores');
  });

  it('should format large numbers correctly', () => {
    expect(component.formatearNumero(1000000)).toBe('1.0M');
    expect(component.formatearNumero(1500)).toBe('1.5K');
    expect(component.formatearNumero(500)).toBe('500');
  });

  it('should change period', () => {
    mockEstadisticasService.obtenerVistasporPeriodo.and.returnValue(of({}));
    component.usuarioId = 1;
    component.cambiarPeriodo('año');
    expect(component.periodoSeleccionado).toBe('año');
    expect(mockEstadisticasService.obtenerVistasporPeriodo).toHaveBeenCalledWith(1, 'año');
  });
});

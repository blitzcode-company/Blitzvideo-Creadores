import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosStudioComponent } from './comentarios-studio.component';

describe('ComentariosStudioComponent', () => {
  let component: ComentariosStudioComponent;
  let fixture: ComponentFixture<ComentariosStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComentariosStudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentariosStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

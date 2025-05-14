import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearStreamComponent } from './crear-stream.component';

describe('CrearStreamComponent', () => {
  let component: CrearStreamComponent;
  let fixture: ComponentFixture<CrearStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearStreamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

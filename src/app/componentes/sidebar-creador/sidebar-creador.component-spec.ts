import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCreadorComponent } from './sidebar-creador.component'

describe('ModalEditarStreamComponent', () => {
  let component: SidebarCreadorComponent;
  let fixture: ComponentFixture<SidebarCreadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarCreadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarCreadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

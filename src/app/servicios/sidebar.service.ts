import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarCollapsed = new BehaviorSubject<boolean>(false);
  public sidebarCollapsed$: Observable<boolean> = this.sidebarCollapsed.asObservable();

  constructor() {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      this.sidebarCollapsed.next(JSON.parse(savedState));
    }
  }

  toggleSidebar(): void {
    const newState = !this.sidebarCollapsed.value;
    this.sidebarCollapsed.next(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  }

  getSidebarState(): boolean {
    return this.sidebarCollapsed.value;
  }

  setSidebarState(collapsed: boolean): void {
    this.sidebarCollapsed.next(collapsed);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }
}

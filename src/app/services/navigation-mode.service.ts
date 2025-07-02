import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NavigationMode = 'complete' | 'conflict-only';

@Injectable({
  providedIn: 'root'
})
export class NavigationModeService {
  private modeSubject = new BehaviorSubject<NavigationMode>('complete');
  public mode$ = this.modeSubject.asObservable();

  constructor() {}

  setMode(mode: NavigationMode): void {
    this.modeSubject.next(mode);
  }

  getCurrentMode(): NavigationMode {
    return this.modeSubject.value;
  }

  isCompleteMode(): boolean {
    return this.getCurrentMode() === 'complete';
  }

  isConflictOnlyMode(): boolean {
    return this.getCurrentMode() === 'conflict-only';
  }

  resetToCompleteMode(): void {
    this.setMode('complete');
  }

  setConflictOnlyMode(): void {
    this.setMode('conflict-only');
  }
} 
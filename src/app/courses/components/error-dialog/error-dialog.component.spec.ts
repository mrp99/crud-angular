import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ErrorDialogComponent } from "./error-dialog.component";
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ErrorDialogComponent,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: 'Test error message' }
      ]
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ErrorDialogComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display the injected error message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test error message');
  });

  it('should show blinking text initially', () => {
    expect(component.showBlinkingText).toBeTrue();
  });

  it('should set showBlinkingText to false and reflect the change', () => {
    component.showBlinkingText = false;
    fixture.detectChanges();
    expect(component.showBlinkingText).toBeFalse();
  });

  it('should toggle showBlinkingText from true to false', () => {
    component.showBlinkingText = true;
    component.showBlinkingText = !component.showBlinkingText;
    fixture.detectChanges();
    expect(component.showBlinkingText).toBeFalse();
  });

  it('should toggle showBlinkingText from false to true', () => {
    component.showBlinkingText = false;
    component.showBlinkingText = !component.showBlinkingText;
    fixture.detectChanges();
    expect(component.showBlinkingText).toBeTrue();
  });

});

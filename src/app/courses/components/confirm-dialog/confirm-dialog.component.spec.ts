import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    // Criando um spy para MatDialogRef com o método close
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatButtonModule,
        ConfirmDialogComponent
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: 'Test success message' },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ConfirmDialogComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display the injected success message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test success message');
  });

  it('should call dialogRef.close with true when onConfirm(true) is called', () => {
    component.onConfirm(true);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should call dialogRef.close with false when onConfirm(false) is called', () => {
    component.onConfirm(false);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});

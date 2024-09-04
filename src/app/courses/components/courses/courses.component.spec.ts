import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { CoursesComponent } from "./courses.component";
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from "@angular/material/snack-bar";
import { CoursesService } from "../../shared/services/courses.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { of, throwError } from "rxjs";
import { mockCoursesPage } from "../../shared/mocks/mockCoursesPage";
import { ErrorDialogComponent } from "../error-dialog/error-dialog.component";
import { mockCourses } from "../../shared/mocks/mockCourses";


describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let coursesServiceSpy: jasmine.SpyObj<CoursesService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['listCourses', 'removeCourse']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    coursesServiceSpy.listCourses.and.returnValue(of(mockCoursesPage));
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        CoursesComponent,
        ConfirmDialogComponent
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'loading').and.callThrough();
    spyOn<any>(component, 'getCourses').and.callThrough();
  });

  it('should create CoursesComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should be call loading() and getCourses() on ngOnInit', () => {
    component.ngOnInit();
    expect(component.loading).toHaveBeenCalled();
    expect(component['getCourses']).toHaveBeenCalled();
  });

  it('should set loadingSpinner to true and after 1 second set loadingSpinner, set dadosCarregados to true and set loadingSpinner to false', fakeAsync(() => {
    component.loading();
    expect(component.loadingSpinner).toBeTrue();
    expect(component.dadosCarregados).toBeFalse();
    tick(1000);
    expect(component.dadosCarregados).toBeTrue();
    expect(component.loadingSpinner).toBeFalse();
  }));

  it('the same test above but this time is using jasmine.clock', () => {
    jasmine.clock().install();
    component.loading();
    expect(component.loadingSpinner).toBeTrue();
    expect(component.dadosCarregados).toBeFalse();
    jasmine.clock().tick(1000);
    expect(component.dadosCarregados).toBeTrue();
    expect(component.loadingSpinner).toBeFalse();
    jasmine.clock().uninstall();
  });

  it('should set courses$ correctly when listCourses returns success', () => {
    (component as any).getCourses();
    fixture.detectChanges();
    component.courses$?.subscribe((courses) => {
      expect(courses).toEqual(mockCoursesPage);
    });
    expect(coursesServiceSpy.listCourses).toHaveBeenCalled();
  });

  it('should call onError and set courses$ to empty when listCourses returns an error', () => {
    const errorMessage = 'ERROR AO CARREGAR OS DADOS!';
    const errorResponse = throwError(() => new Error('Erro ao carregar dados'));
    coursesServiceSpy.listCourses.and.returnValue(errorResponse);
    spyOn<any>(component, 'onError');
    (component as any).getCourses();
    fixture.detectChanges();
    component.courses$?.subscribe((courses) => {
      expect(courses).toEqual({ courses: [], totalElements: 0, totalPages: 0 });
    });
    expect(component['onError']).toHaveBeenCalledWith(errorMessage);
    expect(coursesServiceSpy.listCourses).toHaveBeenCalled();
  });

  it('should not call dialog.open if errorMsg is an empty string', () => {
    const errorMsg = '';
    spyOn<any>(component, 'onError').and.callThrough();
    (component as any).onError(errorMsg);
    expect(dialogSpy.open).not.toHaveBeenCalled();
    expect(component['onError']).toHaveBeenCalledWith(errorMsg);
  });

  it('should not call dialog.open if errorMsg is null', () => {
    const errorMsg = null;
    spyOn<any>(component, 'onError').and.callThrough();
    (component as any).onError(errorMsg);
    expect(dialogSpy.open).not.toHaveBeenCalled();
  });

  it('should not call dialog.open if errorMsg is undefined', () => {
    const errorMsg = undefined;
    spyOn<any>(component, 'onError').and.callThrough();
    (component as any).onError(errorMsg);
    expect(dialogSpy.open).not.toHaveBeenCalled();
  });

  it('should open the ErrorDialogComponent with the error message when onError is called', () => {
    const errorMsg = 'Erro ao carregar dados!';
    (component as any).onError(errorMsg);
    expect(dialogSpy.open).toHaveBeenCalledWith(ErrorDialogComponent, { data: errorMsg });
  });

  it('should navigate to the "new" route when onAdd is called', () => {
    component.onAdd();
    const spy = routerSpy.navigate as jasmine.Spy;
    expect(spy).toHaveBeenCalledTimes(1);
    const argsAdd = spy.calls.first().args;
    expect(argsAdd[0]).toEqual(['new']);
    expect(argsAdd[1]).toEqual({ relativeTo: activatedRouteSpy });
  });

  it('should navigate to the "edit" route when onEdit is called', () => {
    component.onEdit(mockCourses);
    const spy = routerSpy.navigate as jasmine.Spy;
    expect(spy).toHaveBeenCalledTimes(1);
    const argsEdit = spy.calls.first().args;
    expect(argsEdit[0]).toEqual(['edit', mockCourses._id]);
    expect(argsEdit[1]).toEqual({ relativeTo: activatedRouteSpy });
  });

  it('should show a snack bar message when removeMsgCourse is called', () => {
    const message = 'Curso removido com sucesso!';
    const action = 'X';
    const config: MatSnackBarConfig = {
      duration: 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    };
    (component as any).removeMsgCourse();
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, action, config);
  });

  it('should set courses$ to the result of listCourses when refresh is called', () => {
    (component as any).refresh();
    fixture.detectChanges();
    component.courses$?.subscribe(courses => {
      expect(courses).toEqual(mockCoursesPage);
    });
    expect(coursesServiceSpy.listCourses).toHaveBeenCalled();
  });

  it('should call onError and set courses$ to empty when listCourses returns an error', () => {
    const errorResponse = throwError(() => new Error('Erro ao carregar dados'));
    coursesServiceSpy.listCourses.and.returnValue(errorResponse);
    spyOn<any>(component, 'onError');
    (component as any).refresh();
    fixture.detectChanges();
    component.courses$?.subscribe(courses => {
      expect(courses).toEqual({ courses: [], totalElements: 0, totalPages: 0 });
    });
    expect(component['onError']).toHaveBeenCalledWith('ERROR AO CARREGAR OS DADOS PÓS DELEÇÃO!');
    expect(coursesServiceSpy.listCourses).toHaveBeenCalled();
  });

  it('should open the confirmation dialog when onRemove is called', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(false) } as MatDialogRef<any>);
    component.onRemove(mockCourses);
    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: 'Tem certeza que deseja remover esse curso?',
    });
  });

  it('should call removeCourse and refresh if the user confirms', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<any>);
    coursesServiceSpy.removeCourse.and.returnValue(of(true));
    spyOn(component as any, 'refresh');
    spyOn(component as any, 'removeMsgCourse');
    component.onRemove(mockCourses);
    expect(coursesServiceSpy.removeCourse).toHaveBeenCalledWith(mockCourses._id);
    expect(component['refresh']).toHaveBeenCalled();
    expect(component['removeMsgCourse']).toHaveBeenCalled();
  });

  it('should not call removeCourse if the user cancels', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(false) } as MatDialogRef<any>);
    component.onRemove(mockCourses);
    expect(coursesServiceSpy.removeCourse).not.toHaveBeenCalled();
  });

  it('should call onError if the removal fails', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<any>);
    coursesServiceSpy.removeCourse.and.returnValue(throwError(() => new Error('Error')));
    spyOn<any>(component, 'onError');
    component.onRemove(mockCourses);
    expect(component['onError']).toHaveBeenCalledWith('Error trying to remove the course.');
  });

});

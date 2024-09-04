import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../shared/services/courses.service';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Course } from '../../shared/interface/course';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CoursePage } from '../../shared/interface/course-page';
import { CoursesListComponent } from '../courses-list/courses-list.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: true,
  imports: [MatCard, MatToolbar, MatProgressSpinner, CoursesListComponent, AsyncPipe]
})
export class CoursesComponent implements OnInit {


  courses$: Observable<CoursePage> | null = null;
  loadingSpinner: boolean = true;
  dadosCarregados: boolean = false;

  displayedColumns: string[] = ['name', 'actions'];

  constructor(
    private service: CoursesService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loading();
    this.getCourses()
  }

  public loading(): void {
    this.loadingSpinner = true;
    setTimeout(() => {
      this.dadosCarregados = true;
      this.loadingSpinner = false;
    }, 1000);
  }

  private getCourses(): void {
    this.courses$ = this.service.listCourses().pipe(
      map((response: CoursePage) => response),
      catchError((error) => {
        this.onError('ERROR AO CARREGAR OS DADOS!');
        return of({ courses: [], totalElements: 0, totalPages: 0 });
      })
    );
  }

  private onError(errorMsg: string): void {
    if (!errorMsg) return;
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  public onAdd(): void {
    this.router.navigate(
      ['new'],
      { relativeTo: this.route }
    );
  }

  public onEdit(course: Course): void {
    this.router.navigate(
      ['edit', course._id],
      { relativeTo: this.route }
    );
  }

  private removeMsgCourse(): void {
    const message: string = "Curso removido com sucesso!";
    const action: string = 'X';
    const config: MatSnackBarConfig = {
      duration: 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    }
    this.snackBar.open(message, action, config);
  }

  private refresh(): void {
    this.courses$ = this.service.listCourses().pipe(
      take(1),
      catchError((error) => {
        this.onError('ERROR AO CARREGAR OS DADOS PÓS DELEÇÃO!');
        return of({ courses: [], totalElements: 0, totalPages: 0 });
      })
    );
  }

  public onRemove(course: Course): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: 'Tem certeza que deseja remover esse curso?',
    }).afterClosed().pipe(
      switchMap(result => result ? this.service.removeCourse(course._id) : of(null)),
      catchError(() => {
        this.onError('Error trying to remove the course.');
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.refresh();
        this.removeMsgCourse();
      }
    });
  }

}





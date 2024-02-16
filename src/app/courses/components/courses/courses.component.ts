import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../shared/services/courses.service';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, of } from 'rxjs';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Course } from '../../shared/interface/course';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];
  loadingSpinner: boolean = true;
  dadosCarregados: boolean = false;

  constructor(
    private service: CoursesService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.iniciarCarregamentoDados();
    this.getCourses()
  }

  public iniciarCarregamentoDados(): void {
    this.loadingSpinner = true;
    setTimeout(() => {
      this.dadosCarregados = true;
      this.loadingSpinner = false;
    }, 1000);
  }

  private getCourses(): void {
    this.service.listCourses().pipe(
      map((response) => {
        this.courses = response;
      }),
      catchError((error) => {
        this.onError('ERROR AO CARREGAR OS DADOS!')
        return of([error]);
      })
    ).subscribe();
  }

  private onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  public onAdd() {
    this.router.navigate(
      ['new'],
      { relativeTo: this.route }
    );
  }

  public onEdit(course: Course) {
    this.router.navigate(
      ['edit', course._id],
      { relativeTo: this.route }
    );
  }



}





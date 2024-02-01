import { Component, OnInit } from '@angular/core';
import { Course } from '../../shared/interface/course';
import { CoursesService } from '../../shared/services/courses.service';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];
  displayedColumns: string[] = ['name', 'category', 'actions'];
  coursesDataSource!: MatTableDataSource<Course>;

  constructor(
    private service: CoursesService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  public initialize(): void {
    this.getCourses();
  }

  private getCourses(): void {
    this.service.listCourses().pipe(
      map((response) => {
        this.courses = response;
        this.coursesDataSource = new MatTableDataSource<Course>(this.courses);
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
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}

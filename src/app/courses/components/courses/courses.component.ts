import { Component, OnInit } from '@angular/core';
import { Course } from '../../shared/interface/course';
import { CoursesService } from '../../shared/services/courses.service';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, of } from 'rxjs';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];
  displayedColumns: string[] = ['name', 'category'];
  coursesDataSource!: MatTableDataSource<Course>;

  constructor(private service: CoursesService) { }

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
        const msg: string = 'ERROR AO CARREGAR OS DADOS!';
        this.onError(msg)
        return of([error]);
      })
    ).subscribe();
  }

  private onError(errorMsg: string) {

  }

  public onAdd() {

  }
}

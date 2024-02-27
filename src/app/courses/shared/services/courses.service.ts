import { Injectable } from '@angular/core';
import { Course } from '../interface/course';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, take } from 'rxjs';
import { HandleErrorService } from './handleError.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = 'api/courses';

  constructor(private http: HttpClient, private errorService: HandleErrorService) { }

  public listCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.API)
      .pipe(
        take(1),
        delay(1000),
        // map(item => { return item; }),
        catchError(errorList => this.errorService.handleErrorList(errorList))
      );
  }

  public loadById(id: string) {
    return this.http.get<Course>(`${this.API}/${id}`);
  }

  public save(data: Partial<Course>) {
    if (data._id) return this.updateCourse(data);
    return this.createCourse(data);
  }

  private createCourse(data: Partial<Course>) {
    return this.http.post<Course>(this.API, data)
      .pipe(
        take(1),
        catchError(errorSave => this.errorService.handleErrorCreate(errorSave))
      );
  }

  private updateCourse(data: Partial<Course>) {
    return this.http.put<Course>(`${this.API}/${data._id}`, data).pipe(
      take(1),
      catchError(errorPut => this.errorService.handleErrorUpdate(errorPut))
    );
  }

  public removeCourse(id: string) {
    return this.http.delete(`${this.API}/${id}`)
      .pipe(
        take(1),
        catchError(erroDelete => this.errorService.handleErrorDelete(erroDelete))
      );
  }

}




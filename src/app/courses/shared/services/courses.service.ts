import { Injectable } from '@angular/core';
import { Course } from '../interface/course';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = '../../../../assets/db.json';

  constructor(private http: HttpClient) { }

  public listCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.API).pipe(
      take(1),
      map(item => {
        console.log("mapItem =>", item);
        return item;
      }),
      catchError(error => this.handleErrorService(error))
    );
  }

  private handleErrorService(error: any): Observable<never> {
    console.error('Ocorreu um erro:', error);
    return new Observable<never>(observer => {
      observer.error('Algo de ruim Aconteceu, tente mais tarde!');
      observer.complete();
    });
  }
}

// Linha 19 - Efeito colateral (pode ser considerado como substituto do tap)
// Linha 20 - Retornando os dados sem modificação, já que o map requer uma transformação
// Linha 32 - Observable seja encerrado!

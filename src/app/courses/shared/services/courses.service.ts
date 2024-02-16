import { Injectable } from '@angular/core';
import { Course } from '../interface/course';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = 'api/courses';

  constructor(private http: HttpClient) { }

  public listCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.API)
      .pipe(
        take(1),
        delay(1000),
        map(item => {
          console.log("item =>", item);
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

  private handleErrorSaveService(saveError: any): Observable<never> {
    console.error("Ocorreu um erro ao Salvar", saveError);
    return new Observable<never>(save => {
      save.error("Erro ao tentar salvar, tente mais tarde!");
      save.complete();
    })
  }

  public save(data: Course) {
    return this.http.post<Course>(this.API, data).pipe(take(1))
      .pipe(
        take(1),
        map(item => {
          console.log("item salvo =>", item);
          return item;
        }),
        catchError(error => this.handleErrorSaveService(error))
      );
  }

  public loadById(id: string) {
    return this.http.get<Course>(`${this.API}/${id}`);
  }

}

// Linha 19 - Efeito colateral (pode ser considerado como substituto do tap)
// Linha 20 - Retornando os dados sem modificação, já que o map requer uma transformação
// Linha 32 - Observable seja encerrado!

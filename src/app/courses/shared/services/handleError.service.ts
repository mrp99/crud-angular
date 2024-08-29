import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

  constructor() { }

  public handleErrorList(error: any): Observable<never> {
    console.error('Ocorreu um erro ao carregar o serviço da lista:', error);
    return throwError(() => new Error('Ocorreu um erro no service, tente mais tarde!'));
  }

  public handleErrorCreate(createError: any): Observable<never> {
    console.error("Ocorreu um erro ao Salvar", createError);
    return throwError(() => new Error("Erro ao tentar salvar, tente mais tarde!"));
  }

  public handleErrorUpdate(putError: any): Observable<never> {
    console.error("Ocorreu um erro no update", putError);
    return throwError(() => new Error("Erro no update, tente mais tarde!"));
  }

  public handleErrorDelete(deleteError: any): Observable<never> {
    console.error("Ocorreu um erro no delete", deleteError);
    return throwError(() => new Error("Erro no delete, tente mais tarde!"));
  }

}

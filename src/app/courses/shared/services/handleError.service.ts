import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

  constructor() { }

  public handleErrorList(error: any): Observable<never> {
    console.error('Ocorreu um erro ao carregar o serviço da lista:', error);
    return new Observable<never>(listError => {
      listError.error('Ocorreu um erro no service, tente mais tarde!');
      listError.complete();
    });
  }

  public handleErrorCreate(createError: any): Observable<never> {
    console.error("Ocorreu um erro ao Salvar", createError);
    return throwError(() => new Error("Erro ao tentar salvar, tente mais tarde!"));
  }

  public handleErrorUpdate(putError: any): Observable<never> {
    console.error("Ocorreu um erro no update", putError);
    return new Observable<never>(updateError => {
      updateError.error("Erro no update, tente mais tarde!");
      updateError.complete();
    });
  }

  public handleErrorDelete(deleteError: any): Observable<never> {
    console.error("Ocorreu um erro ao remover o curso!", deleteError);
    return new Observable<never>(deleteError => {
      deleteError.error("Erro ao remover o curso!, tente mais tarde!");
      deleteError.complete();
    });
  }


}

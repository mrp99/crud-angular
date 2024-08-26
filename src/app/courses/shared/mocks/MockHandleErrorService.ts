import { throwError, Observable } from 'rxjs';

export class MockHandleErrorService {
  handleErrorList(error: any): Observable<never> {
    return throwError(() => new Error('Ocorreu um erro no service, tente mais tarde!'));
  }

  handleErrorCreate(error: any): Observable<never> {
    return throwError(() => new Error('Erro ao tentar salvar, tente mais tarde!'));
  }

  handleErrorUpdate(error: any): Observable<never> {
    return throwError(() => new Error('Erro no update, tente mais tarde!'));
  }

  handleErrorDelete(error: any): Observable<never> {
    return throwError(() => new Error('Erro ao remover o curso, tente mais tarde!'));
  }
}

import { TestBed } from "@angular/core/testing";
import { HandleErrorService } from "./handleError.service";
import { catchError, of } from "rxjs";

describe('HandleErrorService', () => {
  let service: HandleErrorService;
  let consoleSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HandleErrorService]
    });
    service = TestBed.inject(HandleErrorService);
    consoleSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    consoleSpy.calls.reset();
  });

  it('Should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log an error to the console and return an observable that throws an error', () => {
    const testError = { message: 'Test error' };

    service.handleErrorList(testError).pipe(
      catchError(err => {
        expect(err.message).toBe('Ocorreu um erro no service, tente mais tarde!');
        return of();
      })
    ).subscribe();

    expect(consoleSpy).toHaveBeenCalledWith('Ocorreu um erro ao carregar o serviço da lista:', testError);
  });

  it('should log an error to the console and return an observable that throws an error for handleErrorCreate', () => {
    const createError = { message: 'Create error' };

    service.handleErrorCreate(createError).pipe(
      catchError(err => {
        expect(err.message).toBe('Erro ao tentar salvar, tente mais tarde!');
        return of();
      })
    ).subscribe();

    expect(consoleSpy).toHaveBeenCalledWith('Ocorreu um erro ao Salvar', createError);
  });

  it('should log an error to the console and return an observable that throws an error for handleErrorUpdate', () => {
    const putError = { message: 'Update error' };

    service.handleErrorUpdate(putError).pipe(
      catchError(err => {
        expect(err.message).toBe('Erro no update, tente mais tarde!');
        return of();
      })
    ).subscribe();

    expect(consoleSpy).toHaveBeenCalledWith('Ocorreu um erro no update', putError);
  });

  it('should log an error to the console and return an observable that throws an error for handleErrorDelete', () => {
    const deleteError = { message: 'Delete error' };

    service.handleErrorDelete(deleteError).pipe(
      catchError(err => {
        expect(err.message).toBe('Erro no delete, tente mais tarde!');
        return of();
      })
    ).subscribe();

    expect(consoleSpy).toHaveBeenCalledWith('Ocorreu um erro no delete', deleteError);
  });

});


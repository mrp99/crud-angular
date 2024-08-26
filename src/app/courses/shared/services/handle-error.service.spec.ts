import { TestBed } from "@angular/core/testing";
import { HandleErrorService } from "./handleError.service";

describe('HandleErrorService', () => {
  let service: HandleErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HandleErrorService]
    });
    service = TestBed.inject(HandleErrorService);
  });

  it('Should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle list errors', () => {
    const errorList = new Error('Test list error');
    spyOn(console, 'error');
    const result = service.handleErrorList(errorList);
    result.subscribe({
      next: (() => { }),
      error: ((err) => {
        expect(err).toEqual('Ocorreu um erro no service, tente mais tarde!');
        expect(console.error).toHaveBeenCalledWith('Ocorreu um erro ao carregar o serviço da lista:', errorList);
      })
    });
  });

  it('should handle create errors', () => {
    const errorCreate = new Error('Test create error');
    spyOn(console, 'error');
    const result = service.handleErrorCreate(errorCreate);
    result.subscribe({
      next: (() => { }),
      error: ((err) => {
        expect(err).toEqual('Erro ao tentar salvar, tente mais tarde!');
        expect(console.error).toHaveBeenCalledWith('Ocorreu um erro ao Salvar', errorCreate);
      })
    });
  });

  it('should handle update errors', () => {
    const errorUpdate = new Error('Test update error');
    spyOn(console, 'error');
    const result = service.handleErrorUpdate(errorUpdate);
    result.subscribe({
      next: (() => { }),
      error: ((err) => {
        expect(err).toEqual('Erro no update, tente mais tarde!');
        expect(console.error).toHaveBeenCalledWith('Ocorreu um erro no update', errorUpdate);
      })
    });
  });

  it('should handle delete errors', () => {
    const errorDelete = new Error('Test delete error');
    spyOn(console, 'error')
    const result = service.handleErrorDelete(errorDelete);
    result.subscribe({
      next: (() => { }),
      error: ((err) => {
        expect(err).toEqual('Erro ao remover o curso!, tente mais tarde!');
        expect(console.error).toHaveBeenCalledWith('Ocorreu um erro ao remover o curso!', errorDelete);
      })
    });
  });

});


import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, AbstractControl, UntypedFormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  constructor() { }

  //Validação de todos os campos de forma generica e um exemplo de recursão.
  public validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) control.markAsTouched({ onlySelf: true });
      else if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
        control.markAsTouched({ onlySelf: true });
        this.validateAllFormFields(control);
      }
    });
  }

  // Método genérico para obter mensagem de erro:
  public getErrorMessage(formGroup: UntypedFormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }

  // Método refatorado para obter mensagem de erro de qualquer campo:
  public getErrorMessageFromField(field: UntypedFormControl): string {
    if (field?.hasError('required')) return 'Campo Obrigatório';
    if (field?.hasError('minlength')) {
      const minlength: number = field.errors?.['minlength']?.['requiredLength'] ?? 5;
      return `Tamanho mínimo precisa ser de ${minlength} caracteres`;
    }
    if (field?.hasError('maxlength')) {
      const maxlength: number = field.errors?.['maxlength']?.['requiredLength'] ?? 30;
      return `Tamanho máximo precisa ser de ${maxlength} caracteres`;
    }
    return 'Campo Inválido';
  }

  // Método genérico para obter mensagem de erro de um campo em um FormArray
  public getFormArrayFieldErrorMessage(formGroup: UntypedFormGroup,
    formArrayName: string, fieldName: string, index: number): string {
    const formArray = formGroup.get(formArrayName) as UntypedFormArray;
    const field = formArray.controls[index].get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }

  // Verificação se o FormArray é obrigatório
  public isFormArrayRequired(formGroup: UntypedFormGroup, formArrayName: string): boolean {
    const formArray = formGroup.get(formArrayName) as UntypedFormArray;
    return !formArray.valid && formArray.hasError('required') && formArray.touched;
  }
}

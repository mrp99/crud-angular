import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CoursesService } from '../../shared/services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form!: FormGroup;
  categories: string[] = ['Front-End', 'Back-End'];

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private location: Location,
    private service: CoursesService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.inicializeMethods();
  }

  public inicializeMethods(): void {
    this.formGroup();

  }

  public onCancel(): void {
    this.location.back();
  }

  public onSubmit() {
    const courseData = this.form.value;
    this.service.save(courseData).subscribe({
      next: (response) => {
        console.log(response);
        this.onSuccess();
        this.onCancel();
      },
      error: () => {
        this.onError();
      }
    });
  }

  private onSuccess(): void {
    const message: string = "Curso salvo com sucesso!";
    const action: string = '';
    const time = { duration: 3000 }
    this.snackBar.open(message, action, time);
  }

  private onError(): void {
    const message: string = "Erro ao salvar o curso!";
    const action: string = '';
    const time = { duration: 3000 }
    this.snackBar.open(message, action, time);
  }

  private formGroup(): void {
    this.form = this.formBuilder.group({
      name: new FormControl('', {
        validators: [Validators.required]
      }),
      category: new FormControl('', {
        validators: [Validators.required]
      })
    });
  }
}


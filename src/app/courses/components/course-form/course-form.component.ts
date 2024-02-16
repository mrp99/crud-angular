import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CoursesService } from '../../shared/services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../shared/interface/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form!: FormGroup;
  categories: string[] = ['Front-End', 'Back-End'];
  isEditing: boolean = false;


  constructor(
    private formBuilder: NonNullableFormBuilder,
    private location: Location,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.inicializeMethods();
  }

  public inicializeMethods(): void {
    this.formGroup();
    this.courseRoute();
  }

  public onCancel(): void {
    this.location.back();
  }

  public onSubmit(): void {
    const courseData = this.form.value;
    this.service.save(courseData).subscribe({
      next: (response) => {
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
      _id: new FormControl(''),
      name: new FormControl('', {
        validators: [Validators.required]
      }),
      category: new FormControl('', {
        validators: [Validators.required]
      }),
    });
  }


  private courseRoute() {
    this.route.data.subscribe(data => {
      const course: Course = data['course'];
      if (course) {
        this.isEditing = true;
        this.form.setValue({
          _id: course._id,
          name: course.name,
          category: course.category
        });
        console.log("chamada do método", course);
      }
    });
  }

  public compareWithCategories(course1: Course, course2: Course): boolean {
    return course1 && course2 ? (course1.category === course2.category) : false;
  }


}


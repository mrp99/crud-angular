import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from '../../shared/services/courses.service';
import { Course } from '../../shared/interface/course';
import { Lesson } from '../../shared/interface/lesson';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form!: FormGroup;
  categories: string[] = ['Front-End', 'Back-End'];
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCourseFromRoute();
  }

  get lessons(): FormArray {
    return this.form.get('lessons') as FormArray;
  }

  onCancel(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const courseData = this.form.value as Course;
      this.service.save(courseData).subscribe({
        next: () => {
          this.showSuccessMessage('Curso salvo com sucesso!');
          this.onCancel();
        },
        error: () => {
          this.showErrorMessage('Erro ao salvar o curso!');
        }
      });
    } else {
      this.showErrorMessage('Formulário inválido. Verifique os campos!');
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);

    if (!field) {
      return 'Campo Inválido';
    }

    const minLength = field.errors?.['minlength']?.requiredLength || 4;
    const maxLength = field.errors?.['maxlength']?.requiredLength || 20;

    if (field.hasError('required')) {
      return 'Campo obrigatório!';
    }

    if (field.hasError('minlength')) {
      return `Tamanho mínimo precisa ser de ${minLength} caracteres!`;
    }

    if (field.hasError('maxlength')) {
      return `Tamanho máximo excedido de ${maxLength} caracteres!`;
    }

    return 'Campo Inválido';
  }

  // getLessonErrorMessage(index: number, fieldName: string): string {
  //   const lessons = this.form.get('lessons') as FormArray;
  //   const lessonFormGroup = lessons.at(index) as FormGroup;
  //   const field = lessonFormGroup.get(fieldName);

  //   if (field?.hasError('required')) {
  //     return 'Campo obrigatório!';
  //   }

  //   return 'Campo Inválido';
  // }

  compareWithCategories(course1: Course, course2: Course): boolean {
    return course1 && course2 ? course1.category === course2.category : false;
  }

  private initForm(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form = this.formBuilder.group({
      _id: [course?._id],
      name: [course?.name, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)]],
      category: [course?.category, [Validators.required]],
      lessons: this.formBuilder.array(this.retrieveLessons(course))
    });

  }

  private retrieveLessons(course: Course): FormGroup[] {
    if (!course?.lessons || course.lessons.length === 0) {
      return [this.createLessonFormGroup()];
    }
    return course.lessons.map(lesson => this.createLessonFormGroup(lesson));
  }

  private createLessonFormGroup(lesson: Lesson = { id: '', name: '', url: '' }): FormGroup {
    return this.formBuilder.group({
      id: [lesson.id],
      name: [lesson.name, [Validators.required]],
      url: [lesson.url, [Validators.required]]
    });
  }

  private loadCourseFromRoute(): void {
    const course: Course = this.route.snapshot.data['course'];
    if (course) {
      this.isEditing = true;
      this.form.patchValue({
        _id: course._id,
        name: course.name,
        category: course.category,
        lessons: this.retrieveLessons(course)
      });
    }
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, '', { duration: 3000 });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, '', { duration: 3000 });
  }

  addLesson(): void {
    const lessons = this.form.get('lessons') as FormArray;
    lessons.push(this.createLessonFormGroup());
  }

  removeLesson(index: number): void {
    const lessons = this.form.get('lessons') as FormArray;
    lessons.removeAt(index);
  }
}

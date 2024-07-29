import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormArray, Validators } from '@angular/forms';
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
  showLessonsTable: boolean = false;
  prefix: string = "https://youtu.be/";


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

  public onCancel(): void {
    this.location.back();
  }

  public compareWithCategories(course1: Course, course2: Course): boolean {
    return course1 && course2 ? course1.category === course2.category : false;
  }

  public getLessonsFormArray() {
    const lessonsObj = (<UntypedFormArray>this.form.get('lessons')).controls;
    return lessonsObj
  }

  public addNewLesson(): void {
    const newLessons = this.form.get('lessons') as UntypedFormArray;
    if (newLessons.length < 3) newLessons.push(this.createLesson());
    else this.showErrorMessage('Você atingiu o limite máximo de 3 lições por curso.');
  }

  public removeLesson(index: number) {
    const removeLessons = this.form.get('lessons') as UntypedFormArray;
    removeLessons.removeAt(index);
  }

  private retrieveLessons(course: Course) {
    const lessons = [];
    if (course?.lessons) {
      course.lessons.forEach(
        lesson => lessons.push(this.createLesson(lesson))
      );
    } else {
      lessons.push(this.createLesson());
    }
    return lessons;
  }

  private createLesson(lesson: Lesson = { id: '', name: '', url: '' }): FormGroup {
    return this.formBuilder.group({
      id: [lesson.id],
      name: [lesson.name],
      url: [lesson.url]
    });
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
    console.log("o que form tem:", this.form);
    console.log("o que form value tem:", this.form.value);
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

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);

    if (!field) return 'Campo Inválido';

    const minLength = field.errors?.['minlength']?.requiredLength || 4;
    const maxLength = field.errors?.['maxlength']?.requiredLength || 20;

    if (field.hasError('required')) return 'Campo obrigatório!';

    if (field.hasError('minlength')) return `Tamanho mínimo
    precisa ser de ${minLength} caracteres!`;

    if (field.hasError('maxlength')) return `Tamanho máximo
    excedido de ${maxLength} caracteres!`;

    return 'Campo Inválido';
  }

  // getLessonErrorMessage(index: number, fieldName: string): string {
  //   const field = this.form.get(`lessons.${index}.${fieldName}`);

  //   if (!field) return 'Campo Inválido';

  //   if (field.hasError('required')) return 'Campo obrigatório!';

  //   return 'Campo Inválido';
  // }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, '', { duration: 3000 });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, '', { duration: 3000 });
  }

  public toggleLessonTable(): void {
    this.showLessonsTable = !this.showLessonsTable;
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


}

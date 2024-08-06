import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from '../../shared/services/courses.service';
import { Course } from '../../shared/interface/course';
import { Lesson } from '../../shared/interface/lesson';
import { FormUtilsService } from '../../shared/services/form-utils.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form!: FormGroup;
  isEditing = false;
  prefix: string = "https://youtu.be/";
  attention: string = "Adicione uma Aula!";
  categories: string[] = ['Front-End', 'Back-End'];


  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public formUtils: FormUtilsService
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
    const lessonsObj = (<FormArray>this.form.get('lessons')).controls;
    return lessonsObj
  }

  public addNewLesson(): void {
    const newLessons = this.form.get('lessons') as FormArray;
    if (newLessons.length < 3) newLessons.push(this.createLesson());
    else this.showErrorMessage('Você atingiu o limite máximo de 3 lições por Curso.');
  }

  public removeLesson(index: number): void {
    const removeLessons = this.form.get('lessons') as FormArray;
    removeLessons.removeAt(index);
  }

  private retrieveLessons(course: Course): FormGroup<any>[] {
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
    const urlControl = new FormControl(lesson.url, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(11)
    ]);

    return this.formBuilder.group({
      id: [lesson.id],
      name: [lesson.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ]],
      url: urlControl
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
      lessons: this.formBuilder.array(this.retrieveLessons(course), Validators.required)
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

  public onSubmit(): void {
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
      this.formUtils.validateAllFormFields(this.form);
      this.showErrorMessage('Formulário inválido. Verifique os campos!');
    }
  }

}

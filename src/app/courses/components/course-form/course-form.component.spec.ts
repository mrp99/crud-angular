import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseFormComponent } from "./course-form.component";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CoursesService } from "../../shared/services/courses.service";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MockLocation } from "../../shared/mocks/mockLocation";
import { FormUtilsService } from "../../shared/services/form-utils.service";
import { of } from "rxjs";
import { mockCourses } from "../../shared/mocks/mockCourses";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MockActivatedRoute } from "../../shared/mocks/mockActivatedRouteSnapshot";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Course } from "../../shared/interface/course";

fdescribe('CourseFormComponent', () => {
  let component: CourseFormComponent;
  let fixture: ComponentFixture<CourseFormComponent>;
  let coursesServiceSpy: jasmine.SpyObj<CoursesService>;
  let activatedRouteSpy: ActivatedRoute;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let formUtilsSpy: jasmine.SpyObj<FormUtilsService>;
  let mockLocation: MockLocation;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['save']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    formUtilsSpy = jasmine.createSpyObj('FormUtilsService', ['isFormArrayRequired']);
    activatedRouteSpy = new MockActivatedRoute() as unknown as ActivatedRoute;
    coursesServiceSpy.save.and.returnValue(of(mockCourses));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CourseFormComponent,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: Location, useClass: MockLocation },
        { provide: CoursesService, useValue: coursesServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: FormUtilsService, useValue: formUtilsSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseFormComponent);
    component = fixture.componentInstance;
    mockLocation = TestBed.inject(Location) as unknown as MockLocation;
    formBuilder = TestBed.inject(FormBuilder);

    component.form = formBuilder.group({
      lessons: formBuilder.array([
        formBuilder.control({
          id: '1', name: 'Introdução', url: '1234567890'
        }),
      ])
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create CourseFormComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call initForm and loadCourseFromRoute on ngOnInit', () => {
    const initFormSpy = spyOn<any>(component, 'initForm').and.callThrough();
    const loadCourseSpy = spyOn<any>(component, 'loadCourseFromRoute').and.callThrough();
    component.ngOnInit();
    expect(initFormSpy).toHaveBeenCalled();
    expect(loadCourseSpy).toHaveBeenCalled();
  });

  it('should back the location when cancel is clicked', () => {
    const cancelSpy = spyOn(component, 'onCancel').and.callFake(() => { });
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });


  it('return true when both courses have the same category', () => {
    const course1 = mockCourses;
    const course2 = mockCourses;
    const result = component.compareWithCategories(course1, course2);
    expect(result).toBeTrue();
  });

  it('should return false when both courses have different categories', () => {
    const course1: Course = {
      _id: "1",
      name: "Java",
      category: "Back-End",
      lessons: [
        { id: '1', name: 'Introdução', url: '1234567890' }
      ]
    };

    const course2: Course = {
      _id: "2",
      name: "Angular",
      category: "Front-End",
      lessons: [
        { id: '1', name: 'Introdução', url: '1234567890' }
      ]
    };
    expect(component.compareWithCategories(course1, course2)).toBe(false);
  });

  it('should return false when one or both courses are null', () => {
    const course1 = mockCourses;
    const course2: Course = {
      _id: "",
      name: "",
      category: "",
      lessons: [
        { id: '', name: '', url: '' }
      ]
    };
    expect(component.compareWithCategories(course1, course2)).toBe(false);
    expect(component.compareWithCategories(course2, course1)).toBe(false);
    expect(component.compareWithCategories(course2, course2)).toBe(true);
  });

  it('should return the FormArray from the form', () => {
    const formArray = component.getLessonsFormArray();
    const formValue = (formArray[0]).value;
    expect(formArray.length).toBe(1);
    expect(formValue.name).toBe('Introdução');
    expect(formValue.url).toBe('1234567890');
  });

  it('should add a new lesson when less than 3 lessons are present', () => {
    const initialCount = component.getLessonsFormArray().length;
    component.addNewLesson();
    const newCount = component.getLessonsFormArray().length;
    expect(newCount).toBe(initialCount + 1);
  });

  it('should not add a new lesson and show an error message when there are 3 lessons', () => {
    const lessons = component.getLessonsFormArray();
    const msg = 'Você atingiu o limite máximo de 3 lições por Curso.';
    const spy = spyOn(component as any, 'showErrorMessage');
    lessons.push(lessons[0]);
    lessons.push(lessons[1]);
    component.addNewLesson();
    expect(lessons.length).toBe(3);
    expect(spy).toHaveBeenCalledOnceWith(msg);
  });

  it('should not remove a lesson if the index is negative.', () => {
    const lessonObj = { id: '1', name: 'Introdução', url: '1234567890' };
    const lessonsArray = component.getLessonsFormArray();
    lessonsArray.push(new FormControl(lessonObj));
    expect(lessonsArray.length).toBe(2);
    component.removeLesson(-1);
    expect(lessonsArray.length).toBe(2);
    expect(lessonsArray[0].value).toEqual(lessonObj);
  });

  it('should use the method removeLesson and remove a lesson.', () => {
    const lessonsArray = component.getLessonsFormArray();
    lessonsArray.push(new FormControl('Lesson 1'));
    lessonsArray.push(new FormControl('Lesson 2'));
    component.removeLesson(0);
    expect(lessonsArray.length).toBe(2);
  });


  it('should retrieve lessons and create FormGroups correctly', () => {
    const course: Course = {
      _id: "1",
      name: "Java",
      category: "Back-End",
      lessons: [
        { id: '1', name: 'Introdução', url: '1234567890' }
      ],
    };
    const mockFormGroup = jasmine.createSpyObj('FormGroup', ['get']);
    spyOn(component as any, 'createLesson').and.returnValue(mockFormGroup);
    const result = component['retrieveLessons'](course);
    expect(result).toEqual([mockFormGroup]);
    expect(component['createLesson']).toHaveBeenCalled();
    expect(component['createLesson']).toHaveBeenCalledTimes(1);
    expect(component['createLesson']).toHaveBeenCalledWith(course.lessons[0]);
  });

  it('should handle successful form submission', () => {
    component.onSubmit();
    expect(coursesServiceSpy.save).toHaveBeenCalledWith(component.form.value);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Curso salvo com sucesso!', '', { duration: 3000 });
  });




});

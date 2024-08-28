import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HandleErrorService } from "./handleError.service";
import { TestBed } from "@angular/core/testing";
import { mockCoursesPage } from '../mocks/mockCoursesPage';
import { mockCourses } from '../mocks/mockCoureses';
import { of, throwError } from "rxjs";
import { Course } from "../interface/course";

fdescribe('CoursesService', () => {
  let service: CoursesService;
  let httpMock: HttpTestingController;
  let errorServiceSpy: jasmine.SpyObj<HandleErrorService>

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HandleErrorService', [
      'handleErrorList',
      'handleErrorCreate',
      'handleErrorUpdate',
      'handleErrorDelete'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService,
        { provide: HandleErrorService, useValue: spy }
      ]
    });

    service = TestBed.inject(CoursesService);
    httpMock = TestBed.inject(HttpTestingController);
    errorServiceSpy = TestBed.inject(HandleErrorService) as jasmine.SpyObj<HandleErrorService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created CoursesService', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve courses via GET - happy path', (done) => {
    const url = 'api/courses';

    service.listCourses().subscribe(courses => {
      expect(courses).toEqual(mockCoursesPage);
      done();
    });

    const http = httpMock.expectOne(url);
    setTimeout(() => {
      http.flush(mockCoursesPage);
    }, 1000);
    expect(http.request.method).toBe('GET');
  });

  it('should handle error response corretly - sad path', (done) => {
    const errorMessage = 'Something went wrong!!';
    const url = 'api/courses';

    errorServiceSpy.handleErrorList.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    service.listCourses().subscribe({
      next: () => fail('Expected an error, not courses'),
      error: (error) => {
        expect(errorServiceSpy.handleErrorList).toHaveBeenCalledWith(jasmine.any(Object));
        expect(error.message).toContain(errorMessage);
        done();
      }
    });

    const http = httpMock.expectOne(url);
    setTimeout(() => {
      http.flush({ error: errorMessage }, { status: 500, statusText: 'Server Error' });
    }, 1000);
  });

  it('should retrieve a course by ID - happy path', () => {
    const url = `api/courses/${mockCourses._id}`;
    service.loadById(mockCourses._id)
      .subscribe(course => {
        expect(course).toEqual(mockCourses);
      });

    const http = httpMock.expectOne(url);
    http.flush(mockCourses);
    expect(http.request.method).toBe('GET');
  });

  it('should call save if has data', () => {
    const data: Partial<Course> = {
      _id: '1',
      name: "Java",
      category: "Back-End",
      lessons: [
        { id: '1', name: 'Introdução', url: '1234567890' }
      ]
    }
    spyOn(service, 'save').and.returnValue(of(mockCourses));
    service.save(data);
    expect(service.save).toHaveBeenCalledWith(data);
  });

  it('should call createCourse if data does not have _id', () => {
    const partialCourseWithoutId: Partial<Course> = {
      name: 'New Course'
    };
    const spy = spyOn<any>(service, 'createCourse')
      .and.returnValue(of({}));
    service.save(partialCourseWithoutId);
    expect(spy).toHaveBeenCalledWith(partialCourseWithoutId);
  });

  it('should call updateCourse if has data._id ', () => {
    const data: Partial<Course> = {
      _id: '1',
      name: "Java",
      category: "Back-End",
      lessons: [
        { id: '1', name: 'Introdução', url: '1234567890' }
      ]
    }
    const spy = spyOn<any>(service, 'updateCourse').and.returnValue(of({}));
    service.save(data);
    expect(spy).toHaveBeenCalledWith(data);
  });


  it('should send a POST request to create a course', () => {
    const courseData: Partial<Course> = { name: 'New Course' };
    const serviceAPI = `${service['API']}`;

    service['createCourse'](courseData).subscribe(response => {
      expect(response).toEqual(mockCourses);
    });

    const http = httpMock.expectOne(serviceAPI);
    http.flush(mockCourses);
    expect(http.request.method).toBe('POST');
  });

  it('should handle errors from HTTP POST request', () => {
    const courseData: Partial<Course> = { name: 'New Course' };
    const errorMsg = 'Erro ao tentar salvar, tente mais tarde!';

    errorServiceSpy.handleErrorCreate.and.returnValue(throwError(() => new Error(errorMsg)));

    service['createCourse'](courseData).subscribe({
      next: () => fail('Expected an error, but got a successful response'),
      error: (error) => {
        expect(error.message).toBe(errorMsg);
        expect(errorServiceSpy.handleErrorCreate).toHaveBeenCalled();
      }
    });

    const http = httpMock.expectOne(`${service['API']}`);
    http.error(new ErrorEvent('NetworkError', { message: errorMsg }));
  });


});



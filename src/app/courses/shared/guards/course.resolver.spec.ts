import { TestBed } from "@angular/core/testing";
import { CoursesService } from "../services/courses.service";
import { CourseResolver } from "./course.resolver";
import { of } from "rxjs";
import { Course } from "../interface/course";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

describe('CourseResolver', () => {
  let resolver: CourseResolver;
  let coursesServiceSPY: jasmine.SpyObj<CoursesService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CoursesService', ['loadById']);
    spy.loadById.and.returnValue(of({ _id: '', name: '', category: '', lessons: [] }));

    TestBed.configureTestingModule({
      providers: [
        CourseResolver,
        { provide: CoursesService, useValue: spy }
      ]
    });

    resolver = TestBed.inject(CourseResolver);
    coursesServiceSPY = TestBed.inject(CoursesService) as jasmine.SpyObj<CoursesService>;
  });

  it('should be created CourseResolver', () => {
    expect(resolver).toBeTruthy();
  });


  it('should return a course from service when id is provided', () => {
    const mockCourse: Course = { _id: '123', name: 'Test Course', category: 'Category', lessons: [] };
    coursesServiceSPY.loadById.and.returnValue(of(mockCourse));

    const routeSnapshot = new ActivatedRouteSnapshot();
    routeSnapshot.params = { id: '123' };
    const stateSnapshot = {} as RouterStateSnapshot;

    let result: Course | undefined;

    resolver.resolve(routeSnapshot, stateSnapshot).subscribe(course => {
      result = course;
    });

    expect(coursesServiceSPY.loadById).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockCourse);
  });

  it('should return a default course when no id is provided', () => {
    const mockCourse: Course = { _id: '123', name: 'Test Course', category: 'Category', lessons: [] };
    coursesServiceSPY.loadById.and.returnValue(of(mockCourse));

    const routeSnapshot = new ActivatedRouteSnapshot();
    routeSnapshot.params = {};

    let result: Course | undefined;
    const defaultCourse: Course = { _id: '', name: '', category: '', lessons: [] };
    const stateSnapshot = {} as RouterStateSnapshot;

    resolver.resolve(routeSnapshot, stateSnapshot).subscribe(course => {
      result = course;
    });

    expect(coursesServiceSPY.loadById).not.toHaveBeenCalled();
    expect(result).toEqual(defaultCourse);
  });


});

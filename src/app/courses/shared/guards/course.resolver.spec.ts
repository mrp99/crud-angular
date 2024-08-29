import { TestBed } from "@angular/core/testing";
import { CoursesService } from "../services/courses.service";
import { CourseResolver } from "./course.resolver";

describe('CourseResolver', () => {
  let resolver: CourseResolver;
  let coursesService: jasmine.SpyObj<CoursesService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CoursesService', ['loadById']);
    TestBed.configureTestingModule({
      providers: [
        CourseResolver,
        { provide: CoursesService, useValue: spy }
      ]
    });

    resolver = TestBed.inject(CourseResolver);
    coursesService = TestBed.inject(CoursesService) as jasmine.SpyObj<CoursesService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

});

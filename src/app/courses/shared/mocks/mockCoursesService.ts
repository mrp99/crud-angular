import { Observable } from "rxjs/internal/Observable";
import { CoursePage } from "../interface/course-page";
import { mockCoursesPage } from "./mockCoursesPage";
import { of } from "rxjs";
import { Course } from "../interface/course";

export class MockCourseService {

  public listCourses(): Observable<CoursePage> {
    return of(mockCoursesPage);
  }

  public save(course: Course): Observable<Course> {
    return of(course);
  }

  public removeCourse(id: string) {
    return of(mockCoursesPage.courses.filter(course => course._id === id));
  }
}


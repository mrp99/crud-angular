import { Observable } from "rxjs/internal/Observable";
import { CoursePage } from "../interface/course-page";
import { mockCoursesPage } from "./mockCoursesPage";
import { of } from "rxjs";

export class MockCourseService {

  public listCourses(): Observable<CoursePage> {
    return of(mockCoursesPage);
  }

  public removeCourse(id: string) {
    return of(mockCoursesPage.courses.filter(course => course._id === id));
  }
}


import { Routes } from "@angular/router";
import { CoursesComponent } from "./components/courses/courses.component";
import { CourseFormComponent } from "./components/course-form/course-form.component";
import { CourseResolver } from "./shared/guards/course.resolver";


export const COURSES_ROUTES: Routes = [
  { path: '', component: CoursesComponent },
  { path: 'new', component: CourseFormComponent, resolve: { course: CourseResolver } },
  { path: 'edit/:id', component: CourseFormComponent, resolve: { course: CourseResolver } },
];

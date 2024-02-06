import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from '../components/courses/courses.component';
import { CourseFormComponent } from '../components/course-form/course-form.component';
import { CoursesLitComponent } from '../components/courses-lit/courses-lit.component';

const routes: Routes = [
  { path: '', component: CoursesComponent },
  { path: 'new', component: CourseFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }

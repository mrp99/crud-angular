import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { CoursesRoutingModule } from './courses-routing.module';

import { CoursesComponent } from './components/courses/courses.component';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoursesListComponent } from './components/courses-list/courses-list.component';



@NgModule({
    imports: [
    CommonModule,
    CoursesRoutingModule,
    ReactiveFormsModule,
    CoursesComponent,
    CourseFormComponent,
    CoursesListComponent
]
})
export class CoursesModule { }

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../../shared/interface/course';


@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent implements OnInit {

  @Input() courses: Course[] = [];
  @Output() addEvent = new EventEmitter<void>();
  @Output() editEvent = new EventEmitter<Course>();
  @Output() remove = new EventEmitter<Course>();


  displayedColumns: string[] = ['name', 'category', 'actions'];

  constructor(

  ) { }

  ngOnInit(): void {
  }

  public onAdd(): void {
    this.addEvent.emit();
  }

  public onEdit(courseEdit: Course): void {
    this.editEvent.emit(courseEdit);
  }

  public onRemove(courseRemove: Course): void {
    console.log("chamda do evento ==", courseRemove);
    this.remove.emit(courseRemove);
  }

}

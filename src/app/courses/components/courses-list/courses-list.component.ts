import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Course } from '../../shared/interface/course';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { CategoryPipe } from '../../shared/pipe/category.pipe';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
  standalone: true,
  imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIcon, MatButton, MatIconButton, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, CategoryPipe]
})
export class CoursesListComponent implements OnInit {

  @Input() set courses(data: Course[]) {
    this.dataSource.data = data;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output() addEvent = new EventEmitter<void>();
  @Output() editEvent = new EventEmitter<Course>();
  @Output() remove = new EventEmitter<Course>();

  dataSource = new MatTableDataSource<Course>();
  displayedColumns: string[] = ['name', 'category', 'actions'];

  constructor() { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public onAdd(): void {
    this.addEvent.emit();
  }

  public onEdit(courseEdit: Course): void {
    this.editEvent.emit(courseEdit);
  }

  public onRemove(courseRemove: Course): void {
    this.remove.emit(courseRemove);
  }


}

import { MatPaginator } from "@angular/material/paginator";

export const MatPaginatorMock = {
  pageSize: 10,
  length: 100,
  pageIndex: 0,
  pageSizeOptions: [5, 10, 20],
  getNumberOfPages: () => Math.ceil(100 / 10), // Simular a função getNumberOfPages
  getPageSize: () => 10,
  getPageIndex: () => 0,
  getLength: () => 100,
  next: jasmine.createSpy('next'),
  previous: jasmine.createSpy('previous'),
} as unknown as MatPaginator;

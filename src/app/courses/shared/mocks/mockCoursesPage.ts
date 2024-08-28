import { CoursePage } from '../interface/course-page';

export const mockCoursesPage: CoursePage = {
  courses: [
    {
      _id: '1',
      name: 'Java',
      category: 'Back-End',
      lessons: [
        { id: '1', name: 'Introdução', url: '1234567890' }
      ]
    },
    {
      _id: '2',
      name: 'Angular',
      category: 'Front-End',
      lessons: [
        { id: '1', name: 'Introdução', url: '1234567891' }
      ]
    },
  ],
  totalElements: 2,
  totalPages: 1
};

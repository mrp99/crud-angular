import { convertToParamMap } from "@angular/router";
import { mockCourses } from "./mockCourses";

export class MockActivatedRoute {
  snapshot = {
    paramMap: convertToParamMap({}),
    queryParamMap: convertToParamMap({}),
    data: {
      course: mockCourses
    }
  };
}

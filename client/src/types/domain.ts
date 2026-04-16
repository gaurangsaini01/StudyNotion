export interface ProfileDetails {
  _id?: string;
  gender?: string;
  dateOfBirth?: string;
  about?: string;
  contactNumber?: string | number;
}

export type AccountType = "student" | "instructor" | "admin";

export interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  accountType: AccountType;
  image?: string;
  additionalDetails?: ProfileDetails;
  courses?: string[];
  courseProgress?: string[];
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  courses?: Course[];
}

export interface RatingAndReview {
  _id: string;
  user?: User;
  course?: string;
  rating: number;
  review?: string;
  createdAt?: string;
}

export interface SubSection {
  _id: string;
  title: string;
  timeDuration?: string;
  description?: string;
  videoURL?: string;
  videoPublicId?: string;
  notesPdfUrl?: string;
  notesPdfName?: string;
  notesPdfPublicId?: string;
  sectionId?: string;
}

export interface Section {
  _id: string;
  sectionName: string;
  subSection: SubSection[];
}

export interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  instructor?: User;
  whatYouWillLearn?: string;
  courseContent: Section[];
  ratingAndReviews?: RatingAndReview[];
  price: number;
  tag?: string[];
  thumbnail: string;
  thumbnailPublicId?: string;
  category?: Category;
  studentsEnrolled: User[] | string[];
  instructions?: string[];
  status?: "draft" | "published";
  recommendationReason?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

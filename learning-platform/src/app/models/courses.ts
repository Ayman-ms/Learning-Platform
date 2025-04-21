export interface Course {
  id: string;
  name: string;
  description: string;
  status: string;
  teacher: string;
  photoPath?: string;
  mainCategory?: string;
  subCategories: string[];
}
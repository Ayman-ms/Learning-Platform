export interface Course {
  id: string;
  name: string;
  description: string;
  status: string;
  teacher: string;
  time: string
  photoPath?: string;
  mainCategory?: string;
  subCategories: string[];
}

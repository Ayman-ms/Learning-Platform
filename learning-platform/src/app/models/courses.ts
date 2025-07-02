export interface Course {
  id: string;
  name: string;
  description: string;
  status: boolean;
  teacher: string;
  photoPath?: string;
  mainCategory?: string;
  subCategories: string[];
  rating: number;
  startDate?: string;
  duration?: string; 
}

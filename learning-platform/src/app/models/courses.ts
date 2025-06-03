export interface Course {
  id: string;
  name: string;
  description: string;
  status: boolean;
  teacher: string;
  photoPath?: string;
  mainCategory?: string;
  subCategories: string[];
}


// export interface Course {
//   id: string;
//   name: string;
//   description: string;
//   status: boolean;
//   teacher: string;
//   photoPath?: string;
//   mainCategory?: string;
//   subCategories: string[];
//   rating?: number; // ⬅️ تقييم من 0 إلى 5
//   startDate?: string; // ⬅️ تاريخ البدء (ISO أو yyyy-mm-dd)
//   duration?: string; // ⬅️ مثال: "6 أسابيع" أو "12 ساعة"
//   learningOutcomes?: string[]; // ⬅️ نقاط مختصرة لما سيتعلمه
// }

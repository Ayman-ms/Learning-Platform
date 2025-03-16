export interface Course {
    id: string;           
    name: string;            
    description: string;   
    status: boolean;        
    teacher: string;       
    time: number;           
    mainCategory?: string;        
    subCategory?: string;        
    courseImage?: string;        
  }
  
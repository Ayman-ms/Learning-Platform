export class Teacher {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone: string;
  profileImage?: string;
  
  constructor(data: Partial<Teacher> = {}) {
    this.id = data.id || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.phone = data.phone || '';
    this.profileImage = data.profileImage || '';
  }
}
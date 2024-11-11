import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/users';
import { SessionService } from 'src/app/services/session/session.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-user-manger',
  templateUrl: './user-manger.component.html',
  styleUrls: ['./user-manger.component.css']
})
export class UserMangerComponent implements OnInit {
  userLoggedIn = false;
  count: number = 0;
  comments!: string;
  countt !: number;

  constructor(private usersService: UserService, public accountService: SessionService) { }
  usersList: Array<User> = [];
  filteredUsers: Array<User> = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  paginatedUsers: Array<User> = [];
  searchText: string = '';

  async ngOnInit() {
    this.usersList = await this.usersService.getUsers() || [];
    this.filteredUsers = this.usersList;
    this.updatePagination();
  }

  // تحديث النتائج بناءً على البحث
  updateSearch() {
    if (this.searchText) {
      this.filteredUsers = this.usersList.filter(user =>
        user.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredUsers = this.usersList;
    }
    this.currentPage = 1; // إعادة تعيين الصفحة إلى الأولى عند البحث
    this.updatePagination();
  }

  //start pagination
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.filteredUsers.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  //end pagination
}

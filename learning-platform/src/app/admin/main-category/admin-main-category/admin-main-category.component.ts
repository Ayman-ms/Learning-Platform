import { Component, OnInit } from '@angular/core';
import { MainCategory } from 'src/app/models/mainCategory';
import { MainCategoryService } from 'src/app/services/mainCategory/mainCategory.service';

@Component({
  selector: 'app-admin-main-category',
  templateUrl: './admin-main-category.component.html',
  styleUrls: ['./admin-main-category.component.css']
})
export class AdminMainCategoryComponent implements OnInit {
  mainCategoryList: Array<MainCategory> = [];
  userLoggedIn = false;
  filteredMainCategory: Array<MainCategory> = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedStudents: Array<MainCategory> = [];
  searchText: string = '';
  paginatedRows: Array<Array<MainCategory>> = [];
  mainCategories: MainCategory = { id: 0, name: '' };

constructor(private mainCategoryService: MainCategoryService){}

async ngOnInit() {
    this.mainCategoryList = await this.mainCategoryService.getMainCategories() || [];
    this.filteredMainCategory = this.mainCategoryList;
  
    console.log("📌 الطلاب المستلمون من API:", this.mainCategoryList);
  
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedStudents = this.filteredMainCategory.slice(startIndex, endIndex);

    this.paginatedRows = [];
    for (let i = 0; i < this.paginatedStudents.length; i += 3) {
      this.paginatedRows.push(this.paginatedStudents.slice(i, i + 3));
    }
  }
}

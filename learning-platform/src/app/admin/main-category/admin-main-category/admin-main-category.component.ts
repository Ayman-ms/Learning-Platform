import { Component, OnInit } from '@angular/core';
import { MainCategory } from 'src/app/models/mainCategory';
import { MainCategoryService } from 'src/app/services/mainCategory/mainCategory.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-main-category',
  templateUrl: './admin-main-category.component.html',
  styleUrls: ['./admin-main-category.component.css']
})
export class AdminMainCategoryComponent implements OnInit {
  mainCategoryList: MainCategory[] = [];
  filteredMainCategory: MainCategory[] = [];
  paginatedRows: MainCategory[][] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  displayAsTable: boolean = true;
  editMode: { [key: string]: boolean } = {};
  newCategory: MainCategory = { id: '', description: '' }; 
  constructor(private mainCategoryService: MainCategoryService, private messageService: MessageService) {}

  async ngOnInit() {
    this.mainCategoryList = (await this.mainCategoryService.getMainCategories()) ?? [];
    this.filteredMainCategory = [...this.mainCategoryList];
    this.updatePagination();
  }

  switchView() {
    this.displayAsTable = !this.displayAsTable;
  }

  enableEditMode(category: MainCategory) {
    this.editMode[category.id] = true;
  }

  disableEditMode(category: MainCategory) {
    this.editMode[category.id] = false;
  }

  async saveCategory(category: MainCategory) {
    let result = await this.mainCategoryService.updateCategory(category.id, category.description);
    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated' });
      this.editMode[category.id] = false;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category' });
    }
  }
  

  async deleteCategory(id: string) {
    let result = await this.mainCategoryService.deleteCategory(id);
    if (result) {
      this.mainCategoryList = this.mainCategoryList.filter(c => c.id !== id);
      this.updatePagination();
    }
  }

  async addNewCategory() {
    try {
      const newCategory: MainCategory = { id: this.generateId(), description: this.newCategory.description };
      const addedCategory = await this.mainCategoryService.addMainCategory(newCategory);
      
      this.mainCategoryList.push(addedCategory); 
      this.updatePagination(); 
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category added' });
    } catch (error) {
      alert("Failed to add category");
    }
  }
  
  generateId(): string {
    return Math.random().toString(36).substr(2, 9); // Generates a random ID
  }
  

  updatePagination(): void {
    this.paginatedRows = [];
    for (let i = 0; i < this.mainCategoryList.length; i += 3) {
      this.paginatedRows.push(this.mainCategoryList.slice(i, i + 3));
    }
  }
}

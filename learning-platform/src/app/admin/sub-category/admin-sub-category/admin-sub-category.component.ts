import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SubCategory } from 'src/app/models/subCategory';
import { SubCategoryService } from 'src/app/services/subCategory/sub-category.service';

@Component({
  selector: 'app-admin-sub-category',
  templateUrl: './admin-sub-category.component.html',
  styleUrls: ['./admin-sub-category.component.css']
})
export class AdminSubCategoryComponent implements OnInit {
  CategoryList: SubCategory[] = [];
  filteredSubCategory: SubCategory[] = [];
  paginatedRows: SubCategory[][] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  displayAsTable: boolean = true;
  editMode: { [key: string]: boolean } = {};
  newCategory: SubCategory = { id: '', description: '' };

  constructor(private subCategoryService: SubCategoryService, private messageService: MessageService) {}

  async ngOnInit() {
    this.CategoryList = (await this.subCategoryService.getSubCategories()) ?? [];
    this.filteredSubCategory = [...this.CategoryList];
    this.updatePagination();
  }

  switchView() {
    this.displayAsTable = !this.displayAsTable;
  }

  enableEditMode(category: SubCategory) {
    this.editMode[category.id] = true;
  }

  disableEditMode(category: SubCategory) {
    this.editMode[category.id] = false;
  }

  async saveCategory(category: SubCategory) {
    let result = await this.subCategoryService.updateCategory(category.id, category.description);
    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated' });
      this.editMode[category.id] = false;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category' });
    }
  }
  

  async deleteCategory(id: string) {
    let result = await this.subCategoryService.deleteCategory(id);
    if (result) {
      this.CategoryList = this.CategoryList.filter(c => c.id !== id);
      this.updatePagination();
    }
  }

  async addNewCategory() {
    try {
      const newCategory: SubCategory = { id: this.generateId(), description: this.newCategory.description};
      const addedCategory = await this.subCategoryService.addSubCategory(newCategory);
      
      this.CategoryList.push(addedCategory);
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
    for (let i = 0; i < this.CategoryList.length; i += 3) {
      this.paginatedRows.push(this.CategoryList.slice(i, i + 3));
    }
  }
}

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination-control',
  templateUrl: './pagination-control.component.html',
  styleUrls: ['./pagination-control.component.css']
})
export class PaginationControlComponent implements OnChanges {
  @Input() items: any[] = [];
  @Input() itemsPerPage: number = 12;
  @Output() paginatedItems = new EventEmitter<any[]>();

  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.currentPage = 1;
      this.calculateTotalPages();
      this.updatePagination();
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
    this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.items.length);
    const paginatedData = this.items.slice(startIndex, endIndex);
    this.paginatedItems.emit(paginatedData);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
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
}
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination-control',
  templateUrl: './pagination-control.component.html',
  styleUrls: ['./pagination-control.component.css']
})
export class PaginationControlComponent implements OnChanges {
  @Input() items: any[] = [];  // البيانات القادمة من المكون الأب
  @Input() itemsPerPage: number = 9; // عدد العناصر في كل صفحة (يمكن تغييره)
  @Output() paginatedItems = new EventEmitter<any[]>(); // لإرسال البيانات بعد التصفية
  @Output() pageChanged = new EventEmitter<number>(); // للإبلاغ عن تغيير الصفحة

  currentPage: number = 1;
  totalPages: number = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.currentPage = 1;  // إعادة الصفحة الأولى عند تغيير البيانات
      this.updatePagination();
    }
  }

  updatePagination(): void {
    if (!this.items) return;
    
    this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedData = this.items.slice(startIndex, endIndex);

    this.paginatedItems.emit(paginatedData); // إرسال البيانات المصنفة للمكون الأب
    this.pageChanged.emit(this.currentPage); // إرسال الصفحة الحالية
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

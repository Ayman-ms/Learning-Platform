import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Search...'; 
  @Output() searchTextChanged = new EventEmitter<string>();

  searchText: string = '';

  onSearchChange(): void {
    this.searchTextChanged.emit(this.searchText);
  }
}

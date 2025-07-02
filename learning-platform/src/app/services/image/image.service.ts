import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
  private readonly baseUrl = 'http://localhost:5270';

  getImagePath(photoPath: string | undefined, fallback: string = 'assets/default.svg'): string {
    if (!photoPath || photoPath.trim() === '') {
      return fallback;
    }

    const unique = new Date().getTime();
    return `${this.baseUrl}${photoPath}?t=${unique}`;
  }

  handleImageError(event: any, fallback: string = 'assets/default.svg') {
    event.target.src = fallback;
  }
}

import { Injectable } from '@angular/core';
import { APP_CONSTANTS	 } from 'src/constants/app.constants';
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  async compressAndConvertToBase64(
    file: File,
    maxWidth: number = APP_CONSTANTS.IMAGE.MAX_DIMENSIONS.width,
    maxHeight: number = APP_CONSTANTS.IMAGE.MAX_DIMENSIONS.height
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target?.result as string;
          
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error('Failed to get canvas context'));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL(
              'image/jpeg',
              APP_CONSTANTS.IMAGE.COMPRESSION_QUALITY
            );
            resolve(compressedBase64);
          };
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  isBase64Image(str: string): boolean {
    if (!str) return false;
    
    if (str.startsWith('data:image')) {
      return true;
    }

    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  }

  convertToBase64Url(imageData: string): string {
    if (this.isBase64Image(imageData)) {
      return imageData.startsWith('data:image') 
        ? imageData 
        : `data:image/jpeg;base64,${imageData}`;
    }
    return imageData;
  }
}
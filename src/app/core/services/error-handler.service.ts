import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  readonly errorMessage = signal<string | null>(null);

  handleHttpError(error: HttpErrorResponse): void {
    const message = this.getErrorMessage(error);
    this.errorMessage.set(message);
    
    console.error('HTTP Error:', error);
    
    setTimeout(() => this.clearError(), 5000);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor';
    }
    
    if (error.status === 404) {
      return 'Recurso no encontrado';
    }
    
    if (error.status >= 500) {
      return 'Error del servidor. Intenta nuevamente';
    }
    
    if (error.error?.message) {
      return error.error.message;
    }
    
    return 'Ocurrió un error. Intenta nuevamente';
  }

  clearError(): void {
    this.errorMessage.set(null);
  }
}

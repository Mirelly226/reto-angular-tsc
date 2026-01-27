import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProduct } from '../models/product.model';
import { IProductApi } from '../models/product-api.model';
import { IApiListResponse, IApiMessageResponse, IApiDeleteResponse } from '../../../core/models/api-response.model';
import { ProductMapper } from '../mappers/product.mapper';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/bp/products`;

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IApiListResponse<IProductApi>>(this.baseUrl).pipe(
      map(response => ProductMapper.fromApiList(response.data))
    );
  }

  getProductById(id: string): Observable<IProduct | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(product => product.id === id))
    );
  }

  createProduct(product: IProduct): Observable<IProduct> {
    const apiProduct = ProductMapper.toApi(product);
    return this.http.post<IApiMessageResponse<IProductApi>>(this.baseUrl, apiProduct).pipe(
      map(response => ProductMapper.fromApi(response.data))
    );
  }

  updateProduct(id: string, product: Omit<IProduct, 'id'>): Observable<IProduct> {
    const apiProduct = ProductMapper.toApiForUpdate(product);
    return this.http.put<IApiMessageResponse<IProductApi>>(`${this.baseUrl}/${id}`, apiProduct).pipe(
      map(response => ProductMapper.fromApi({ ...response.data, id }))
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<IApiDeleteResponse>(`${this.baseUrl}/${id}`).pipe(
      map(() => void 0)
    );
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }
}

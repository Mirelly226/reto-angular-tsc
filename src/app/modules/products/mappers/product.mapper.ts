import { IProduct } from '../models/product.model';
import { IProductApi } from '../models/product-api.model';

export class ProductMapper {
  static fromApi(apiProduct: IProductApi): IProduct {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      description: apiProduct.description,
      logo: apiProduct.logo,
      releaseDate: ProductMapper.parseDate(apiProduct.date_release),
      revisionDate: ProductMapper.parseDate(apiProduct.date_revision),
    };
  }

  static fromApiList(apiProducts: IProductApi[]): IProduct[] {
    return apiProducts.map(ProductMapper.fromApi);
  }

  static toApi(product: IProduct): IProductApi {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: ProductMapper.formatDate(product.releaseDate),
      date_revision: ProductMapper.formatDate(product.revisionDate),
    };
  }

  static toApiForUpdate(product: Omit<IProduct, 'id'>): Omit<IProductApi, 'id'> {
    return {
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: ProductMapper.formatDate(product.releaseDate),
      date_revision: ProductMapper.formatDate(product.revisionDate),
    };
  }

  private static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private static parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }
}

import { ProductMapper } from './product.mapper';
import { IProduct } from '../models/product.model';
import { IProductApi } from '../models/product-api.model';

describe('ProductMapper', () => {
  const mockApiProduct: IProductApi = {
    id: 'test-id-123',
    name: 'Test Product',
    description: 'Test product description for testing purposes',
    logo: 'https://example.com/logo.png',
    date_release: '2026-06-15',
    date_revision: '2027-06-15'
  };

  const mockProduct: IProduct = {
    id: 'test-id-123',
    name: 'Test Product',
    description: 'Test product description for testing purposes',
    logo: 'https://example.com/logo.png',
    releaseDate: new Date(2026, 5, 15, 12, 0, 0, 0),
    revisionDate: new Date(2027, 5, 15, 12, 0, 0, 0)
  };

  describe('fromApi', () => {
    it('should transform IProductApi to IProduct', () => {
      const result = ProductMapper.fromApi(mockApiProduct);

      expect(result.id).toBe(mockApiProduct.id);
      expect(result.name).toBe(mockApiProduct.name);
      expect(result.description).toBe(mockApiProduct.description);
      expect(result.logo).toBe(mockApiProduct.logo);
      expect(result.releaseDate).toBeInstanceOf(Date);
      expect(result.revisionDate).toBeInstanceOf(Date);
    });

    it('should parse dates correctly', () => {
      const result = ProductMapper.fromApi(mockApiProduct);

      expect(result.releaseDate.getFullYear()).toBe(2026);
      expect(result.releaseDate.getMonth()).toBe(5);
      expect(result.releaseDate.getDate()).toBe(15);
      expect(result.releaseDate.getHours()).toBe(12);

      expect(result.revisionDate.getFullYear()).toBe(2027);
      expect(result.revisionDate.getMonth()).toBe(5);
      expect(result.revisionDate.getDate()).toBe(15);
    });
  });

  describe('fromApiList', () => {
    it('should transform array of IProductApi to array of IProduct', () => {
      const mockApiProducts: IProductApi[] = [
        mockApiProduct,
        { ...mockApiProduct, id: 'test-id-456', name: 'Second Product' }
      ];

      const result = ProductMapper.fromApiList(mockApiProducts);

      expect(result.length).toBe(2);
      expect(result[0].id).toBe('test-id-123');
      expect(result[1].id).toBe('test-id-456');
      expect(result[1].name).toBe('Second Product');
    });

    it('should return empty array when given empty array', () => {
      const result = ProductMapper.fromApiList([]);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('toApi', () => {
    it('should transform IProduct to IProductApi', () => {
      const result = ProductMapper.toApi(mockProduct);

      expect(result.id).toBe(mockProduct.id);
      expect(result.name).toBe(mockProduct.name);
      expect(result.description).toBe(mockProduct.description);
      expect(result.logo).toBe(mockProduct.logo);
      expect(result.date_release).toBe('2026-06-15');
      expect(result.date_revision).toBe('2027-06-15');
    });

    it('should format dates correctly with leading zeros', () => {
      const productWithShortDate: IProduct = {
        ...mockProduct,
        releaseDate: new Date(2026, 0, 5, 12, 0, 0, 0),
        revisionDate: new Date(2027, 0, 5, 12, 0, 0, 0)
      };

      const result = ProductMapper.toApi(productWithShortDate);

      expect(result.date_release).toBe('2026-01-05');
      expect(result.date_revision).toBe('2027-01-05');
    });

    it('should format dates correctly for December', () => {
      const productWithDecember: IProduct = {
        ...mockProduct,
        releaseDate: new Date(2026, 11, 25, 12, 0, 0, 0),
        revisionDate: new Date(2027, 11, 25, 12, 0, 0, 0)
      };

      const result = ProductMapper.toApi(productWithDecember);

      expect(result.date_release).toBe('2026-12-25');
      expect(result.date_revision).toBe('2027-12-25');
    });
  });

  describe('toApiForUpdate', () => {
    it('should transform IProduct to IProductApi without id', () => {
      const result = ProductMapper.toApiForUpdate(mockProduct);

      expect('id' in result).toBe(false);
      expect(result.name).toBe(mockProduct.name);
      expect(result.description).toBe(mockProduct.description);
      expect(result.logo).toBe(mockProduct.logo);
      expect(result.date_release).toBe('2026-06-15');
      expect(result.date_revision).toBe('2027-06-15');
    });

    it('should format dates correctly in update payload', () => {
      const productForUpdate: Omit<IProduct, 'id'> = {
        name: 'Updated Product',
        description: 'Updated description for the product',
        logo: 'https://example.com/new-logo.png',
        releaseDate: new Date(2026, 2, 10, 12, 0, 0, 0),
        revisionDate: new Date(2027, 2, 10, 12, 0, 0, 0)
      };

      const result = ProductMapper.toApiForUpdate(productForUpdate);

      expect(result.date_release).toBe('2026-03-10');
      expect(result.date_revision).toBe('2027-03-10');
    });
  });

  describe('Date formatting edge cases', () => {
    it('should handle leap year dates', () => {
      const leapYearProduct: IProduct = {
        ...mockProduct,
        releaseDate: new Date(2024, 1, 29, 12, 0, 0, 0),
        revisionDate: new Date(2025, 1, 28, 12, 0, 0, 0)
      };

      const result = ProductMapper.toApi(leapYearProduct);

      expect(result.date_release).toBe('2024-02-29');
      expect(result.date_revision).toBe('2025-02-28');
    });

    it('should handle end of year dates', () => {
      const endOfYearProduct: IProduct = {
        ...mockProduct,
        releaseDate: new Date(2025, 11, 31, 12, 0, 0, 0),
        revisionDate: new Date(2026, 11, 31, 12, 0, 0, 0)
      };

      const result = ProductMapper.toApi(endOfYearProduct);

      expect(result.date_release).toBe('2025-12-31');
      expect(result.date_revision).toBe('2026-12-31');
    });
  });

  describe('Bidirectional transformation', () => {
    it('should maintain data integrity when converting back and forth', () => {
      const apiToProduct = ProductMapper.fromApi(mockApiProduct);
      const productBackToApi = ProductMapper.toApi(apiToProduct);

      expect(productBackToApi.id).toBe(mockApiProduct.id);
      expect(productBackToApi.name).toBe(mockApiProduct.name);
      expect(productBackToApi.description).toBe(mockApiProduct.description);
      expect(productBackToApi.logo).toBe(mockApiProduct.logo);
      expect(productBackToApi.date_release).toBe(mockApiProduct.date_release);
      expect(productBackToApi.date_revision).toBe(mockApiProduct.date_revision);
    });
  });
});

import { ProductModel } from './productModel';
export interface CartModel{
  count: number;
  productData: ProductModel[];
}

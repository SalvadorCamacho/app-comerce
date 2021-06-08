import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartModel } from '../../model/CartModel';
import { ProductModel } from '../../model/productModel';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss'],
})
export class CartViewComponent implements OnInit {
   @Input('prod') productsInCart: ProductModel[] = [];


  constructor(private casrtService: CartService) { }

  ngOnInit() {
   }

   updateQuantity(p: ProductModel, ev: any, index: number){
     const updateInCartValue = ev.target.value;
     this.casrtService.updateQuantity(index, updateInCartValue);
   }

   removeItemFromCart(prod : ProductModel) {
     this.productsInCart = this.casrtService.removeFromCart(prod);

   }


}

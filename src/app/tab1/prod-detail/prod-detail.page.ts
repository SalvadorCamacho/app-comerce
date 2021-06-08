
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductModel } from '../../model/productModel';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-prod-detail',
  templateUrl: './prod-detail.page.html',
  styleUrls: ['./prod-detail.page.scss'],
})
export class ProdDetailPage implements OnInit {

  product : ProductModel;
  showData : boolean = false;
  temp : string;
  x : number;
  constructor(private route: ActivatedRoute,
              private productService : ProductService,
              private cartService : CartService) { }

  ngOnInit() {
     this.route.data.subscribe(
       (data: {product:ProductModel}) =>{
        // this.product = data.product;
         this.showData = true;
         this.temp = data.product.description;
         this.temp = this.temp.trim();
         if(this.temp.substring(0,1)==='<'){
           this.x = this.temp.length - 4;
           this.temp = this.temp.substring(3,this.x);
           console.log(this.temp);
           this.product = data.product;
           this.product.description = this.temp;
         }else{
           this.product = data.product;
         }
       }
     )
  }

  addProduct(product : ProductModel){
       this.cartService.addToCart(product);
  }

}




 /*
    let id;
        this.route.params.subscribe(
        (data: Params) => {
           id = data.id;
           this.productService.getSingleProduct(id).subscribe(
             (prod : ProductModel) => {
               this.product = prod;
          });
         });
   */

         /*
 this.route.data.subscribe((data:{product:ProductModel}) =>{
       this.product = data.product;
       this.showData = true;
    })
         */

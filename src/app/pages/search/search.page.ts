import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductModel } from '../../model/productModel';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  filteredProducts: any[] = [];
  showSkeleton: boolean;
  touched : boolean;

  constructor(private productService : ProductService) { }

  ngOnInit() {
  }

  search(ev: any){
    this.touched = false;
    this.filteredProducts = [];
    this.showSkeleton = true;
    this.productService.searchProducts(ev.target.value).subscribe(
      (prods : ProductModel[]) => {
          if(prods.length <=0){
             this.touched = true;
          }else{
            this.touched = false;
          }
          this.showSkeleton = false;
          this.filteredProducts = prods;
      });  //, error: err => console.log(err));
  }


}

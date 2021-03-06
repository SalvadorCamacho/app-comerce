import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductModel } from '../../model/productModel';
import { CustomerModel } from '../../model/CustomerModel';
import { environment } from '../../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { OrderModel } from '../../model/OrderModel';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  constructor(public cartService: CartService) { }
  isPersonalUp: boolean;
  isBillingUp: boolean;
  isShippingUp: boolean;
  isPaymentUp: boolean;
  sameShipping: boolean;
  paymentGateway: PaymentGateway[] = [];
  subTotal = 0;
  cartTotal = 0;
  products: ProductModel[] = [];
  userDetails: CustomerModel;
  mexicanStates = environment.states;
  taxesRate;
  finalTax = 0;
  math = Math;


  async ngOnInit() {
    this.isPersonalUp = false;
    this.isBillingUp = false;
    this.isShippingUp = false;
    this.isPaymentUp = false;
    this.sameShipping = true;

    this.cartService.getAllPaymentGateways()
        .pipe(
            map((pg: PaymentGateway[]) => pg.filter(p => p.enabled === true))
        ).subscribe(pg => {
        this.paymentGateway = pg;
       // console.log(this.paymentGateway);
    });

    this.cartService.cartData.subscribe(data => this.products = data.productData);

    this.cartService.cartTotal.subscribe(total => this.cartTotal = total);

    if(localStorage.getItem('user')!==null){
      this.userDetails = JSON.parse(localStorage.getItem('user')!);
    }
   // this.storage.get('user').then(userData => this.userDetails = userData);

    this.cartService.getTaxes()
        .pipe(
            map((taxes: any[]) => taxes.map(t => t.rate))
        )
        .subscribe(data => {
            let taxRate: number;
           // console.log(data);
            // @ts-ignore
            taxRate = parseInt(data[0], 10);
         //  taxRate = 16; //IVA del 16% para probar
            this.taxesRate = taxRate;
            this.subTotal = this.cartTotal;
            let taxCalculation = (this.taxesRate * this.subTotal) / 100;
            if (taxCalculation < 1) {
                taxCalculation = 1;
                this.finalTax = taxCalculation;
            } else {
                this.finalTax = Math.floor(Math.abs((this.taxesRate * this.subTotal) / 100));
            }
            this.cartTotal = this.subTotal + this.finalTax;
        }, err => console.error(err));
  }

  toggleUp(section: string) {
    switch (section) {
        case 'billing':
            this.isBillingUp = !this.isBillingUp;
            break;
        case 'shipping':
            this.isShippingUp = !this.isShippingUp;
            break;
        case 'payment':
            this.isPaymentUp = !this.isPaymentUp;
            break;
        default:
            this.isPersonalUp = !this.isPersonalUp;
            break;
    }
}

toggleShipping() {
  this.sameShipping = !this.sameShipping;
}

checkout(checkoutForm: NgForm) {
  const data = checkoutForm.value;
  const user = JSON.parse(localStorage.getItem('user')!);
  const lineItems: LineItemsModel[] = [];
  this.products.forEach(p => {
      lineItems.push({
          product_id: p.id,
          quantity: parseInt(String(p.in_cart), 10)
      });
  });
  let formData: OrderModel = null;

  if (this.sameShipping) {
      formData = {
          set_paid: true,
          payment_method: this.paymentGateway[0].id,
          payment_method_title: this.paymentGateway[0].method_title,
          // customer_id: this.userDetails[0].id,

          customer_id: user[0].id > 0 ? user[0].id : 0,
          billing: {
              address_1: data.b_address_line_1,
              address_2: data.b_address_line_2,
              city: data.b_city,
              state: data.b_state,
              country: 'MX',
              postcode: data.b_postcode,
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              phone: data.phone,
          },
          shipping: {
              address_1: data.b_address_line_1,
              address_2: data.b_address_line_2,
              city: data.b_city,
              state: data.b_state,
              country: 'MX',
              postcode: data.b_postcode,
              first_name: data.first_name,
              last_name: data.last_name
          },
          line_items: lineItems
      };
  } else {
      formData = {
          set_paid: true,
          payment_method: this.paymentGateway[0].id,
          payment_method_title: this.paymentGateway[0].method_title,
          customer_id: user[0].id > 0 ? user[0].id : 0,
          billing: {
              address_1: data.b_address_line_1,
              address_2: data.b_address_line_2,
              city: data.b_city,
              state: data.b_state,
              country: 'MX',
              postcode: data.b_postcode,
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              phone: data.phone,
          },
          shipping: {
              address_1: data.s_address_line_1,
              address_2: data.s_address_line_2,
              city: data.s_city,
              state: data.s_state,
              country: 'MX',
              postcode: data.s_postcode,
              first_name: data.first_name,
              last_name: data.last_name
          },
          line_items: lineItems
      };
  }

  // @ts-ignore
  this.cartService.createOrder(formData).then(); //generar finalmente pedido permantente

}

}  //End of class



interface PaymentGateway {
  description: string;
  enabled: boolean;
  title: string;
  id: string;
  method_description: string;
  method_title: string;
}

// tslint:disable-next-line:class-name
export interface LineItemsModel {
  product_id: number;
  quantity: number;
  variation_id?: number;
}

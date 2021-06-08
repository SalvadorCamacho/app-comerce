
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartModel } from '../model/CartModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

import { ProductModel } from '../model/productModel';
import { OrderModel } from '../model/OrderModel';
import { WriteObject } from './backend.interceptor';

@Injectable({
  providedIn: 'root'
})
export class CartService {
   //Local variables
   private serverUrl : string = environment.backend_api_url;
   private cartDataArray: CartModel = {
      count: 0,
      productData: []
   }

   private cartData$ = new BehaviorSubject<CartModel>
   ({count:0, productData:[]});
   private totalAmount=0;
   private totalAmount$ = new BehaviorSubject<number>(0);


  constructor(private httpClient : HttpClient,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private toastController: ToastController,
              private router : Router) {

              this.totalAmount = 0;
              if(localStorage.getItem('cart')!==null){
                   this.cartDataArray = JSON.parse(localStorage.getItem('cart')!);
                   this.cartData$.next(this.cartDataArray);
              }
              this.calculateTotal();
        }
            /*  this.storage.get('cart').then(data =>{
                if(data){
                   this.cartDataArray = data;
                   this.cartData$.next(this.cartDataArray);
                }
              });*/



      async addToCart(product: ProductModel){
               const loader: HTMLIonLoadingElement =
               await this.loadingController.create({
                 message: 'Adding to cart..',
                 animated: true,
                 spinner: "circles",
                 backdropDismiss: false,
                 showBackdrop: true
               });

               const alert: HTMLIonAlertElement =
               await this.alertController.create({
                  header: 'Cart Updated',
                  buttons: [{
                    text: 'Continue',
                    role: 'cancel',
                    cssClass: 'continue',
                    handler:() =>{
                      console.log('Product added');
                    }
                  },
                  {
                    text: "View cart",
                    cssClass: 'view-cart',
                    handler: () => {
                      this.router.navigateByUrl('/tabs/tab3').then();
                    }
                  }
                ],
                animated: true,
                message: "Product added to cart",
                backdropDismiss: false,
                cssClass: "add-product"
               });

               const toast: HTMLIonToastElement = //No more than 5 products
               await this.toastController.create({
                 message: "Only 5 alowed in cart",
                 header: 'Max Quantity Reached',
                 duration: 2000,
                 position: "bottom",
                 animated: true,
                 color: "warning",
                 buttons: [
                   {
                     side: "end",
                     role: "cancel",
                     text: "OK"
                   }
                 ]
               });
            await loader.present().then();
            //When the cart is not completely empty
          if(this.cartDataArray.count !== 0){
              //Calculate Index
              const index: number = this.cartDataArray.productData.findIndex(
                p  => p.id === product.id);
               if(index > -1){
                if(this.cartDataArray.productData[index].in_cart >=5){
                  this.calculateTotal();
                  this.cartDataArray.productData[index].in_cart = 5;
               //   this.storage.set('cart', {...this.cartDataArray}).then();
                  localStorage.setItem('cart',JSON.stringify({...this.cartDataArray}));
                  await loader.dismiss().then();
                  await toast.present().then();
               }else{
                 this.cartDataArray.productData[index].in_cart +=1;
                 this.calculateTotal();
              //   this.storage.set('cart', {...this.cartDataArray}).then();
                 localStorage.setItem('cart',JSON.stringify({...this.cartDataArray}));
                 await loader.dismiss().then();
                 await alert.present().then();
               }
               this.cartData$.next(this.cartDataArray);
               //End if cart is not empty
            } else{
               this.cartDataArray.productData.push(product);
               const newProducIndex: number = this.cartDataArray.productData.findIndex(
                p  => p.id === product.id);
                this.cartDataArray.productData[newProducIndex].in_cart =1;
                this.calculateTotal();
                await loader.dismiss().then();
                await alert.present().then();
                this.cartDataArray.count = this.cartDataArray.productData.length;
              //  this.storage.set('cart', {...this.cartDataArray}).then();
                localStorage.setItem('cart',JSON.stringify({...this.cartDataArray}));
                this.cartData$.next(this.cartDataArray);
            }
              //if count === 0
          } else{
            this.cartDataArray.productData.push({...product, in_cart: 1});
            this.cartDataArray.count = this.cartDataArray.productData.length;
            this.calculateTotal();
          //  this.storage.set('cart', {...this.cartDataArray}).then();
            localStorage.setItem('cart',JSON.stringify({...this.cartDataArray}));
            await loader.dismiss().then();
            await alert.present().then();
            this.cartData$.next(this.cartDataArray);
          }
     } //end of addCart()

     removeFromCart(product : ProductModel){
       this.cartDataArray.productData = this.cartDataArray.productData.filter(p => p.id !== product.id);
       this.cartDataArray.count = this.cartDataArray.productData.length;

       this.cartData$.next(this.cartDataArray);
       this.totalAmount$.next(this.totalAmount);
       localStorage.setItem('cart',JSON.stringify({...this.cartDataArray}));
       return this.cartDataArray.productData;
     }

     private calculateTotal(){
       this.totalAmount = 0;
       if(this.cartDataArray.productData.length === 0){
         this.totalAmount = 0;
         this.totalAmount$.next(this.totalAmount);
         return;
       }
       this.cartDataArray.productData.forEach(p =>{
         this.totalAmount += parseInt(p.price, 10) * p.in_cart;
       });

       this.totalAmount$.next(this.totalAmount);
     }

     updateQuantity(indexOfProduct: number, newInCartValue: number){
       this.cartDataArray.productData[indexOfProduct].in_cart = newInCartValue;
       this.calculateTotal();
       localStorage.setItem('cart',JSON.stringify({...this.cartDataArray}));
       this.cartData$.next(this.cartDataArray);
       this.totalAmount$.next(this.totalAmount);
     }

     private emptyCart(){
       this.cartDataArray = {
        count: 0,
        productData: []
       };
       this.calculateTotal();
       this.cartData$.next(this.cartDataArray);
     }

     get cartData(): Observable<CartModel>{
       return this.cartData$.asObservable();
     }

     get cartTotal(): Observable<number>{
       return this.totalAmount$.asObservable();
     }

     getAllPaymentGateways(){
       return this.httpClient.get(`${this.serverUrl}/payment_gateways`);
     }

     getTaxes(){
       return this.httpClient.get(`${this.serverUrl}/taxes`);
     }

     async createOrder(orderData: OrderModel){
      let headers = new HttpHeaders().set(WriteObject, '');
      headers = headers.set('Content-Type', 'application/json, charset=utf-8');
      const loader = await this.loadingController.create({
         message: 'Placing order...',
         animated: true,
         spinner: "circular"
      });

      const toast2: HTMLIonToastElement = //Revisar correo o algo salió mal
            await this.toastController.create({
              message: "Check mail please...",
              header: 'Complete form',
              duration: 3000,
              position: "top",
              animated: true,
              color: "warning",
              buttons: [
                {
                  side: "end",
                  role: "cancel",
                  text: "OK"
                }
              ]
            });

      await loader.present().then();
      this.httpClient.post(`${this.serverUrl}/orders`, {...orderData}, {headers})
          .subscribe(async (newOrderDetails: any) => {
              await loader.dismiss().then();
              const navigationExtras: NavigationExtras = {
                  state : {
                      message: 'Order Placed',
                      products: this.cartDataArray.productData,
                      orderId: newOrderDetails.id,
                      total: parseFloat(newOrderDetails.total)
                  }
              }
              this.emptyCart(); //Limpiar carrito
              this.router.navigate(['/thankyou'], navigationExtras).then();
          }, async (err) => {
            await loader.dismiss().then();
            await toast2.present().then();
            console.log(err);
         });
     }

  }


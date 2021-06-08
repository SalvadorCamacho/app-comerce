import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductModel } from '../model/productModel';
import { LoadingController, MenuController, ModalController, ToastController } from '@ionic/angular';
import { SortModalComponent } from '../Components/sort-modal/sort-modal.component';
import { CategoryModel } from '../model/CategoryModel';
import { CartService } from '../services/cart.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  sliderImages: string[] = [
    '/assets/slide1',
    '/assets/slide2',
    '/assets/slide3',
    '/assets/slide4',
    '/assets/slide5',
    '/assets/slide6'
  ];

  listArrayOfProducts: ProductModel[] =[];
  displayedList: ProductModel[] = [];
  currentPage : number = 1;
  filterCount: number = 0; //Contar cuantas categorías tienes
  filteredCategoryList: any[] = []; //Arreglo de categorías filtradas
  categories: CategoryModel[] = []; //Todas las categorías
  count: number;

  constructor(private productService: ProductService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalControler: ModalController,
    private menuControler: MenuController,
    private cartService : CartService) {
      this.loadMoreData(null).then();
    }

  async ngOnInit(){
     const loader: HTMLIonLoadingElement = await this.loadingController.create({
       message: 'Getting products...',
       spinner: "lines",
       animated: true
     });

    await loader.present().then();
    this.productService.getAllProducts().subscribe( async (products: ProductModel[]) => {
      await loader.dismiss().then();
      this.listArrayOfProducts = products;
      this.displayedList = [ ...this.listArrayOfProducts];
   }, async (err) => {
      await loader.dismiss().then();
      console.log(err);
   });
   this.categories = await this.productService.getAllCategories().toPromise();
   // console.log(this.categories);

    this.cartService.cartData.pipe(
        map(data => data.count)).subscribe(
         count => this.count = count);
  }

  sliderOptions = {
    autoplay:{
      dealy:2000
    },
    loop: true
  }

  async loadMoreData(ev: any){
     const toast: HTMLIonToastElement = await this.toastController.create({
       message: 'No More Products',
       animated: true,
       duration: 2000,
       buttons: [
         {
           text: 'Done',
           role: 'cancel',
           icon: 'close'
         }
       ]
     });

     if(ev == null){
       this.currentPage = 1;
     } else{
       this.currentPage++;
       this.productService.getAllProducts(this.currentPage).subscribe(
          async (prods: ProductModel[]) => {
          this.listArrayOfProducts = this.listArrayOfProducts.concat(prods);
          this.displayedList = [...this.listArrayOfProducts];
          if(ev === null){ //Termina, ya no hay elementos
            ev.tarject.complete();
          }
          if(prods.length <5){//Cerrar mensaje o toast
            await toast.present().then();
            ev.target.disabled = true;
          }
        }, async(err)=>{
          console.log(err);
         }
        );

    }//else
  }

  loadingSpinner(){
    this.loadingController.create({
      message: "Loading details...",
      animated: true,
      spinner: "crescent",
      backdropDismiss: false,
      showBackdrop: true
    }).then((el = new HTMLIonLoadingElement) => el.present());
  }

  openModal(){
    this.modalControler.create({
      component: SortModalComponent,
      animated: true,
      cssClass: 'sortModal'
    }).then((el = new HTMLIonModalElement) => {
      el.present().then();
      return el.onDidDismiss().then(resultData => {
          this.sort({role: resultData.role, data: resultData.data});
      })
    });
  }


  sort(resultData : {role: string, data: any}) {
         const {role, data} = {...resultData};
         if(role === 'cancel'){
               return;
         }
         else if(role === 'sort'){
             if(data === 'title-asc'){
                this.displayedList.sort((a : ProductModel, b: ProductModel) =>{
                   const x: string = a.name.toLowerCase();
                   const y: string = b.name.toLowerCase();

                   if(x<y){
                     return -1;
                   }
                   if(x>y){
                    return 1;
                  }
                  return 0;

                });
             }
             else if(data === 'title-desc'){
              this.displayedList.sort((a : ProductModel, b: ProductModel) =>{
                 const x: string = a.name.toLowerCase();
                 const y: string = b.name.toLowerCase();

                 if(x>y){
                   return -1;
                 }
                 if(x<y){
                  return 1;
                }
                return 0;
              });
           }
           else if(data === 'price-asc'){
            this.displayedList.sort((a : ProductModel, b: ProductModel) =>{
              //@ts-ignore
              return a.price - b.price; //Low to high
            });
           }
           else if(data === 'price-desc'){
            this.displayedList.sort((a : ProductModel, b: ProductModel) =>{
              //@ts-ignore
              return b.price - a.price; //High to low
            });
           }


         }
  }

  openFilter(){
    this.menuControler.enable(true, 'filter').then();
    this.menuControler.open('filter').then();
  }

  categoryFilter(ev: {name: string, selected: boolean}){
       //if the user clicked the filter for the first time and
       //nothing is selected:
       if(ev.selected && this.filterCount === 0){
         this.filteredCategoryList.push(ev.name);
         this.filterCount++;
         this.displayedList = this.displayedList.filter(
           p => p.categories.some(cat => cat.name === ev.name));
       }
       //If the category selected is not present in the list of items
       else if(ev.selected && this.filterCount >=1){
        const newArray = [...this.listArrayOfProducts];
        this.filterCount++;
        //Si la lista de categorías filtradas no tiene el nombre seleccionado
        if(!this.filteredCategoryList.includes(ev.name)){
          this.filteredCategoryList.push(ev.name);//Agrega la categoría
          const product = newArray.filter(p => p.categories.some
            (cat => cat.name === ev.name)); //Filtra por categoría
          let i : any;
          product.forEach(p => {
            i = this.displayedList.findIndex(prod => prod.id === p.id);
          //If product is present in the array
          if(i !== -1){
            return;
          } else {
            this.displayedList = this.displayedList.concat(p);
          }
        });
    } else {
      return;
    }

   }//end of else if (second one)
    else if(!ev.selected && this.filterCount >= 1){ //Cuando deseleccionamos
      const newArray = [...this.listArrayOfProducts];
       this.filterCount--; //Decrementa el contador (una categoría)
       //Remove the category from the filter list array
       this.filteredCategoryList = this.filteredCategoryList.filter
       (el => el !== ev.name);
       if(this.filteredCategoryList.length > 0){
         this.displayedList = [];
         this.filteredCategoryList.forEach(el => {
           this.displayedList = this.displayedList.concat(
             newArray.filter(p => p.categories.some(cat => cat.name === el))
             );
         })
       //  console.log('entró a eliminar');
       }
       //If the filter count has reached 0, that means no filter is present now
       if(this.filterCount === 0){
         this.displayedList = [...this.listArrayOfProducts];
       }
    }

  }

  segmentChange(ev: any){
       const value = ev.target.value;
       if(value === 'featured'){
         this.displayedList = this.listArrayOfProducts.filter(p => p.featured === true);
       } else {
         this.displayedList = [...this.listArrayOfProducts];
       }
  }
}


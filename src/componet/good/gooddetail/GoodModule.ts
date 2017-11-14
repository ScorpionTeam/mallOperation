/*商品类*/
export interface  Good{
  categoryId?:number;
  goodName?:string;
  description?:string;
  promotion?:number;
  price?:number;
  stock?:number;
  isOnSale?:boolean;
  isHot?:boolean;
  isNew?:boolean;
  isFreight?:boolean;
  brandId?:number;
  discount?:number;
  goodNo?:string;
}


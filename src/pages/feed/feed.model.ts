export class FeedPostModel {
  id: string;
		product_id:string;
  category_id:string;
  status:string;
  store_id:string;
  tax_id:string;
  title:string;
  description:string;
  descriptionDisplay:string;
  keywords:string;
  price:string;
  language:string;
  specifications:string;
  style_code:string;
  color:string;
  condition:string;
  size:string;
  quantity:string;
  view:string;
  created:Date;
  feature_date:Date;
  gallery_date:Date;
  banner_a:string;
  banner_b:string;
  banner_c:string;
  todays_deal:string;
  discount:string;
  date_lost:Date;
  date_born:Date;
  sub_category:string;
  weight:number=0;
  height:number=0;
  name_of_pet:string;
  country:string;
  contact:string;
  pet_status:string;
  count_down_end_date:Date;
  last_seen_appearance:string;
  questions:string;
  pet_id:string;
  gender:string;
  country_id:string;
  sub_country_id:string;
  image:string;
  filename:string;
	likecnt: number = 0;
  ownlike: number = 0;
  commentcnt: number = 0;
  app_table: string;
  country_title: string;
  subcountry_title :string;
  country_title_zh: string;
  subcountry_title_zh :string;
}

 export class DataModel {
  status: string;
  message: string;
	records: string;
	pets: Array<FeedPostModel>;
	
}

export class FeedModel {
  success: string;
  data: DataModel;
  category: any;
}

import { DateTime } from "ionic-angular";


export class UserModel {
  status: string;
  message: string;
  id: number = 0;
  tc: number =0;
  user_id = 0;
  lastname : string;
  firstname :string;
  email:string;
  street:string;
  city:string;
  about:string;
  newsletter: string;
  seller:string;
  notification:string;
  gender:string;
  birthday: Date;
  bio:string;
  country_id:number =0;
  sub_country_id:number=0;
  fb_uid: string ='http://graph.facebook.com/100001704123828/picture';

}


/*

{success:true; 
data:{
  status:true;
  message:Successfully Login!;
  id:494;
  tc:0;
  user_id:494;
  lastname:Ka;
  firstname:Ricky;
  email:rickykei@yahoo.com.hk;
  street:null;
  city:null;
  about:null;
  newsletter:null;
  seller:null;
  notification:null;
  gender:M;
  birthday:null;
  bio:null;
  country_id:1;
  sub_country_id:307}}
*/

/*export class ProfileModel {

  success : boolean;
  user: UserModel = new UserModel();
  
}*/

/*
export class UserModel {
  image: string;
  location: string;
  about: string;
  email: string;
  phone: string;
  name: string;
  website: string;
}

*/

/*
export class ProfilePostModel {
  date: Date;
	image: string;
	description: string;
	likes: number = 0;
	comments: number = 0;
	liked: boolean = false;
}*/

export class ProfileModel {
  success : string;
  data: UserModel = new UserModel();
  // following: Array<UserModel> = [];
  // followers: Array<UserModel> = [];
  // posts: Array<ProfilePostModel> = [];
}

export class CountryIdModel{
  zone:Array<ZoneModel>;
}

export class ZoneModel{
  country_id: string;
  parent_id: string;
  title: string;
  title_zh: string;
  description: string;
  language: string;
}

export class PetModel{
  success:string;
  data:Array<PetDetailsModel>;
}

export class PetDetailsModel{

  product_id:string;
        category_id:string;
        status:string;
        store_id:string;
        tax_id:string;
        title:string;
        description:string;
        descriptionDisplay:string;
        keywords:string;
        price:number;
        language:string;
        specifications:string;
        style_code:string;
        color:string;
        condition:string;
        size:string;
        quantity:number;
        view:string;
        created:DateTime;
        feature_date:Date;
        gallery_date:Date;
        banner_a:string;
        banner_b:string;
        banner_c:string;
        todays_deal:string;
        discount:string;
        date_lost:DateTime;
        date_born:DateTime;
        sub_category:number;
        weight:number;
        height:number;
        name_of_pet:string;
        country:string;
        contact:string;
        pet_status:0;
        count_down_end_date:DateTime;
        last_seen_appearance:string;
        questions:string;
        pet_id:string;
        gender:string;
        country_id:string;
        sub_country_id:number;
        image:string;
}
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

export class LoginModel {
  success : string;
  data: LoginUserModel = new LoginUserModel();
}

export class LoginUserModel{
  status : String;
  message : string;
  id: number;
  username : string;
  image : string;
}

export class ProfileModel {
  success : string;
  data: UserModel = new UserModel();
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
        id:string;
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
        likecnt: number = 0;
	      ownlike: number = 0;
}
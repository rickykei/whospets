import { DateTime } from "ionic-angular";

export class UserModel {
  status: string;
  message: string;
  id: string;
  tc: number =0;
  user_id : string;
  lastname : string;
  firstname :string;
  email:string;
  street:string;
  city:string;
  about:string;
  newsletter: string;
  seller:string;
  language:string;
  notification:string;
  gender:string;
  birthday: Date;
  bio:string;
  country_id:number =0;
  sub_country_id:number=0;
  fb_uid: string ='https://graph.facebook.com/100001704123828/picture';
  owndogs:number;
  owncats:number;
}

export class FollowerModel {
  id: string;
  username:string;
  user_id:string;
  follower_user_id:string;
  followed:string;
  image: string;
  isfollowed:boolean;
  // location: string;
  // about: string;
  // email: string;
  // phone: string;
  // name: string;
  // website: string;
}

export class ResponseModel {
  success : string;
  data: LoginUserModel = new LoginUserModel();
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
  tc: number =0;
  user_id : string;
  lastname : string;
  firstname :string;
  email:string;
  street:string;
  city:string;
  about:string;
  newsletter: string;
  seller:string;
  language:string;
  notification:string;
  gender:string;
  birthday: Date;
  bio:string;
  country_id:number =0;
  sub_country_id:number=0;
  fb_uid: string ='https://graph.facebook.com/100001704123828/picture';

}

export class ProfileModel {
  success : string;
  data: UserModel = new UserModel();
  following: Array<FollowerModel> = [];
  followers: Array<FollowerModel> = [];
}

export class SearchUserModel {
  success : string;
  data: Array<FollowerModel> = [];
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
        user_id:string;
        product_id:string;
        category_id:string;
        petbreed:string;
        petbreed_zh:string;
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
        color_zh:string;
        condition:string;
        size:string;
        size_zh:string;
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
        weight:string;
        height:string;
        name_of_pet:string;
        country:string;
        contact:string;
        pet_status:number =0;
        pet_Status_string:string;
        count_down_end_date:DateTime;
        last_seen_appearance:string;
        questions:string;
        pet_id:string;
        gender:string;
        gender_zh:string;
        country_id:string;
        sub_country_id:string;
        image:string;
        image_large:string;
        filename:string;
        likecnt: number = 0;
        ownlike: number = 0;
        app_table: string;
        commentcnt: number = 0;
        country_title: string;
        subcountry_title :string;
        country_title_zh: string;
        subcountry_title_zh :string;
        product_title:string;
        owner_pet_id:number;
        pet_type:string;
        pet_type_zh:String;
        postusername:string;
        postuserimage:string;
        
}
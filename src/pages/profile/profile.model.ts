export class UserModel {
  image: string = './assets/images/slide-2-img.png';
  status: boolean;
  message: string;
  id: number = 0;
  tc: number =0;
  user_id = 0;
  lastname : string = 'lastname';
  firstname :string;
  email:string;
  street:string;
  city:string;
  about:string;
  newsletter:string;
  seller:string;
  notification:string;
  gender:string;
  birthday: Date;
  bio:string;
  country_id:number =0;
  sub_country_id:number=0;
}


/*

{"success":"true", 
"data":{
  "status":"true",
  "message":"Successfully Login!",
  "id":"494",
  "tc":"0",
  "user_id":"494",
  "lastname":"Ka",
  "firstname":"Ricky",
  "email":"rickykei@yahoo.com.hk",
  "street":null,
  "city":null,
  "about":null,
  "newsletter":null,
  "seller":null,
  "notification":null,
  "gender":"M",
  "birthday":null,
  "bio":null,
  "country_id":"1",
  "sub_country_id":"307"}}
*/

export class ProfileModel {

  success : boolean;
  user: UserModel = new UserModel();
  
}

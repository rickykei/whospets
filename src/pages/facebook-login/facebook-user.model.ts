export class FacebookUserModel {
  image: string;
  gender: string;
  name: string;
  email: string;
  userId: string;
  first_name: string;
  last_name:string;
  friends: Array<string> = [];
  photos: Array<string> = [];
}

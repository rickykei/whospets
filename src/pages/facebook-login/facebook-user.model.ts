export class FacebookUserModel {
  image: string;
  gender: string;
  name: string;
  email: string;
  userId: string;
  firstname: string;
  lastname:string;
  friends: Array<string> = [];
  photos: Array<string> = [];
}

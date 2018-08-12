export class FacebookUserModel {
  image: string;
  gender: string;
  name: string;
  email: string;
  userId: string;
  friends: Array<string> = [];
  photos: Array<string> = [];
}

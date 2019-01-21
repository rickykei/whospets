import { UserModel } from "../profile/profile.model";

export class LoginModel {
  success: string;
  data: UserModel = new UserModel();
}

export class LoginContentModel{
  email: string;
  password: string;
  uid: string;
}

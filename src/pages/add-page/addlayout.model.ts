export class PetBreedModel{
  pet:Array<BreedModel>;
}
export class BreedModel {
  category_id:string;
  parent_id:string;
  title:string;
  title_zh:string;
  description:string;
  language:string;
}

export class PetColorModel{
  pet_color:Array<ColorModel>;
}
export class ColorModel {
  color:string;
  color_zh:string;
}

export class PetStatusModel{
  pet_status:Array<StatusModel>;
}
export class StatusModel {
  status:string;
  id:string;
}

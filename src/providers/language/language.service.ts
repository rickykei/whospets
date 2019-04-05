import { Injectable } from "@angular/core";
import { LanguageModel } from "./language.model";

@Injectable()
export class LanguageService {
  languages : Array<LanguageModel> = new Array<LanguageModel>();

   constructor() {
     this.languages.push(
       {name: "English", code: "en"},
       {name: "中文", code: "zh"}
     );
   }

   getLanguages(){
     return this.languages;
   }
 }

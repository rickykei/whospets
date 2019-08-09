export class ListingModel {
  populars: Array<ListingItemModel>;
  categories: Array<ListingItemModel>;
  banner_title: string;
  banner_image: string;
}

export class ListingItemModel {
  title: string;
  title_zh: string;
  image: string;
  catid: string;
  group_ids: string[];
}

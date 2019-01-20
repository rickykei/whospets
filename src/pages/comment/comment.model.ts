export class CommentModel{
  success:string;
  data:Array<CommentDetailsModel>;
}

export class CommentDetailsModel{
        id:string;
        user_id:string;
        content_id:string;
        store_id:string;
        order_id:string;
        create_date:string;
        feedback:string;
        comment:string;
        product_id:string;
        table_name:string;
}
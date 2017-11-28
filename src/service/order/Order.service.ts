import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
@Injectable()
export class OrderService{
  constructor(private http:Http){}
}

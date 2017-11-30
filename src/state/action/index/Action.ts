export interface Actions{
  type:string;
  playload?:any;
}

export const SHOW_LOADING:string = "show";
export const HIDE_LOADING:string="hide";

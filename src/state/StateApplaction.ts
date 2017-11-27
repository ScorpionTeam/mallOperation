import {Action} from "@ngrx/store";

export const LOADING = 'LOADING';
export let num = false;
export function stateReducer(state:number=0, action:Action){
  if(action.type=="LOADING"){
    console.log("loading");
    num=true
  }else if(action.type=="LOADOUT"){
    console.log("loadout");
    num=false;
  }
  console.log(action);

}

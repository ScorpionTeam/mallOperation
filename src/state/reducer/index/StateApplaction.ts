import * as load from "../../action/index/Action"

const initialState = {
  show:false
};

export function reducer(state = initialState, action: load.Actions) {
  switch (action.type) {
    case load.SHOW_LOADING: {
      return {
        show:true
      };
    }

    case load.HIDE_LOADING: {
      return {
        show:false
      };
    }
    default: {
      return state;
    }
  }
}

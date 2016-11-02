export function loginFieldUpdate(field, value) {
  return {
    type: 'LOGIN_FIELD_UPDATE',
    field: field,
    value: value
  }
};

// this one is a thunk 
export function loginSubmit(email, password) {
  return dispatch => {
    dispatch({type: "LOGIN_REQUEST"});

    var loginParams = {
      email: email,
      password: password
    }

    var headers = new Headers({
      "Content-Type": "application/json"
    });

    fetch('https://clerk.density.io/tokens/', {
        method: 'POST',
        body: loginParams
      })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else if (response.status == 403) {
          console.log("403");
          throw new Error(response.json()['detail']);
        } else {
          console.log(response.status);
          console.log("is error");
          throw new Error(response.statusText);
        }
      }).then(function(json) {
        dispatch({type: "LOGIN_SUCCESS"});
      }).catch(function(error) {
        console.log(error);
        dispatch({
          type: "LOGIN_FAILURE",
          message: error.message
        });
      })
  }
}
export function loginUpdate(field, value) {
  return {
    type: 'LOGIN_UPDATE',
    field: field,
    value: value
  }
};

// this one is a thunk 
export function loginSubmit(email, password) {
  return dispatch => {
    dispatch({type: "LOGIN_REQUEST"})

    // fetch('/login')
    //   .then(function(response) {
    //     return response.text()
    //   }).then(function(body) {
    //     document.body.innerHTML = body
    //   })

    // $.ajax({
    //   method: 'get',
    //   url: 'http://asdf.com'
    // }).done(function (data){
    //   dispatch({type: "LOGIN_SUCCESS"});
    // }).fail(function (xhr, etc, etc2) {
      dispatch({type: "LOGIN_FAILURE"});
    // })
  }
}
export function tokensGet(jwt) {
  return dispatch => {
    

    // for now, let's fake it til this endpoint exists!
    var json = {
      sandboxToken: "ciI6eyJsYXN0IjoiV2VpbnJlaWNoIiwiZW1haWwiOiJicmlhbkBkZW5zaXR5LmlvIiwiZmlyc3QiOiJCcmlhbiJ9LCJleHAiOjE0Nzg2NDM0ODR9.sDfuoXFFg8umt0Kq5ZZ2_IWNJoYZx8hZuLpQHJ9hcsurpf1hqxc0P28GxkcQhIv-6lIHMH-358uocNjPFEVytnruLYDeyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0NzgwMzg2ODQsImF1dGgiOnsib3JncyI6W3sicGVybXMiOlsiYXBpLm1hbmFnZV9lbnYiLCJhcGkudmlld19lbnYiXSwiaWQiOiI2d2tRcm9RUUE4SGlNbFBlbkN1eWVJIiwibmFtZSI6IkRlbnNpdHkgSW5jIn1dfSwidXNloGPrWrhnsJNnJXD3aIv76TbeKJk_EFeGysUUs",
      liveToken: "bGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0NzgwMzg2ODQsImF1dGgiOnsib3JncyI6W3sicGVybXMiOlsiYXBpLm1hbmFnZV9lbnYiLCJhcGkudmlld19lbnYiXSwiaWQiOiI2d2tRcm9RUUE4SGlNbFBlbkN1eWVJIiwibmFtZSI6IkRlbnNpdHkgSW5jIn1eyJhdfSwidXNlciI6eyJsYXN0IjoiV2VpbnJlaWNoIiwiZW1haWwiOiJicmlhbkBkZW5zaXR5LmlvIiwiZmlyc3QiOiJCcmlhbiJ9LCJleHAiOjE0Nzg2NDM0ODR9.sDfuoXFFg8umt0Kq5ZZ2_IWNJoYZx8hZuLpQHJ9hcsurpf1hqxc0P28GxkcQhIv-6lIHMH-358uocNjPFEVytnruLYDoGPrWrhnsJNnJXD3aIv76TbeKJk_EFeGysUUs"
    }
    dispatch({type: 'TOKENS_SUCCESS', json: json})
    return;
    // the rest won't get executed...


    fetch('https://clerk.density.io/org_tokens/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
    })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else if (response.status == 403) {
        return response.json().then(({detail}) => {
          throw new Error(detail);
        });
      } else {
        throw new Error(response.statusText);
      }
    }).then(function(json) {
      console.log('success' + json);
    }).catch(function(error) {
      dispatch({type: 'TOKENS_FAILURE', message: error.message});
    })
  }
}

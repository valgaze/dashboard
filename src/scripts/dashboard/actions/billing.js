import {BOOKIE_URL} from 'dashboard/constants';
import {DensityToaster} from 'dashboard/components/DensityToaster';

export function billingSetCVC(val) {
  return {
    type: 'BILLING_SET_CVC',
    value: val, 
  }
}

export function billingSetExp(val) {
  return {
    type: 'BILLING_SET_EXP',
    value: val, 
  }
}

export function billingSetNumber(val) {
  return {
    type: 'BILLING_SET_NUMBER',
    value: val, 
  }
}

export function billingSubmit(cardNumber, cardCvc, cardExp) {
  return (dispatch, getState) => {
    if (cardNumber==null || cardCvc == null || cardExp == null) {
      return DensityToaster.show({ message: "Please enter all fields.", timeout: 8000, className: "pt-intent-danger" });
    } else if (cardExp.length != 4) {
      return DensityToaster.show({ message: "Please enter an 4-digit expiration date.", timeout: 8000, className: "pt-intent-danger" });
    }
    DensityToaster.show({ message: "Saving credit card information...", timeout: 3000, className: "pt-intent-primary" });
    Stripe.card.createToken({
      number: cardNumber,
      cvc: cardCvc,
      exp_month: cardExp.substring(0,2), 
      exp_year: cardExp.substring(2,4),
    }, (status, data) => {
      if (status.toString()[0] !== '2') { 
        DensityToaster.show({ message: data.error.message, timeout: 8000, className: "pt-intent-danger" });
      } else {
        let stripeToken = data.id;
        let lastFour = data.card.last4;
        dispatch(createCustomer(stripeToken, lastFour));
      }
    });
  }
}

function createCustomer(stripeToken, lastFour) {
  return (dispatch, getState) => {
    let state = getState();

    var params = {
      stripe_token: stripeToken,
      last_four: lastFour
    }
    fetch(`${BOOKIE_URL}/billing/sources`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.user.token}`
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
        DensityToaster.show({ message: response.statusText, timeout: 8000, className: "pt-intent-danger" });
        throw new Error(response.statusText);
      }
    }).then(function(json) {
      DensityToaster.show({ message: "Your card has been saved.", timeout: 8000, className: "pt-intent-primary" });
      dispatch({type: 'BILLING_SUCCESS'});
      dispatch(getCustomer());
    }).catch(function(error) {
      DensityToaster.show({ message: error.message, timeout: 8000, className: "pt-intent-danger" });
    })
  }
}

export function getCustomer() {
  return (dispatch, getState) => {
    let state = getState();
    fetch(`${BOOKIE_URL}/billing/sources/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.user.token}`
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
      console.log(json);
      dispatch({
        type: 'BILLING_CUSTOMER_SUCCESS',
        data: json
      });
    }).catch(function(error) {
      dispatch({type: 'BILLING_CUSTOMER_FAILURE', message: error.message});
    })
  }
}
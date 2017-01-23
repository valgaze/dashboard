import React from 'react';
import {connect} from 'react-redux';
import Card from 'react-credit-card';
import NumberFormat from 'react-number-format';

import Appbar from 'dashboard/components/Appbar';
import Sidebar from 'dashboard/components/Sidebar';

import {billingSetCVC, billingSetExp, billingSetNumber, billingSubmit} from 'dashboard/actions/billing';

function Billing({
  cardCvc,
  cardExp,
  cardNumber,
  sources,
  onChangeCVC,
  onChangeExp,
  onChangeNumber,
  onSubmitPressed
}) {

  function formatExpiryChange(val) {
    if(val && Number(val[0]) > 1){
      val = '0'+val;
    }
    if(val && val.length >1 && Number(val[0]+val[1]) > 12){
      val = '12'+val.substring(2,val.length);
    }
    val = val.substring(0,2)+ (val.length > 2 ? '/'+val.substring(2,4) : '');
    return val;
  }

  var creditCardString = sources.length == 1 ? "credit card" : "credit cards";

  return (
    <div>
      <Appbar />
      <div className="row">
        <Sidebar />
        <div className="col-xs-24 col-md-20">
          <div className="billing-section">
            <div className="row">
              <div className="col-xs-22 off-xs-2 col-md-18 off-md-1">
                <h1>Payment Information</h1>
                <div className="row">
                  <div className="col-xs-22 col-md-12 off-md-0">
                    <div className="credit-card-form card">
                      <div className="card-body">
                        <div className="number">
                          <label>Credit Card Number</label>
                          <NumberFormat className="form-control" value={cardNumber} format="#### #### #### ####" onChange={onChangeNumber} />
                        </div>
                        <div className="exp">
                          <label>Expiration Date</label>
                          <NumberFormat className="form-control" value={cardExp} format={formatExpiryChange} onChange={onChangeExp} />
                        </div>
                        <div className="cvc">
                          <label>CVC</label>
                          <NumberFormat className="form-control" value={cardCvc} onChange={onChangeCVC} />
                        </div>
                        <div className="submit">
                          <button 
                            className="button button-primary submit-button"
                            onClick={onSubmitPressed(cardNumber, cardCvc, cardExp)}
                            type="button">
                            Submit Credit Card
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-22 col-md-12 off-md-0">
                    <div className="credit-card-on-file">
                      {sources ? `You have ${sources.length} ${creditCardString} on file.` : "You do not have a credit card on file."}
                      {sources && sources.map(function(source, i) {
                        return (
                          <ul key={i}>
                            <li>Card ending in {source.last_four}</li>
                          </ul>
                        )
                      })}
                    </div>
                    <Card 
                        cvc = {cardCvc}
                        number = {cardNumber}
                        expiry = {parseInt(cardExp)}
                        namePlaceholder = ""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  cardNumber: state.billing.number,
  cardExp: state.billing.exp,
  cardCvc: state.billing.cvc,
  sources: state.billing.sources,
});

const mapDispatchToProps = dispatch => ({
  onChangeCVC: (e, val) => {
    dispatch(billingSetCVC(val));
  },
  onChangeExp: (e, val) => {
    dispatch(billingSetExp(val));
  },
  onChangeNumber: (e, val) => {
    dispatch(billingSetNumber(val));
  },
  onSubmitPressed: (cardNumber, cardCvc, cardExp) => () => {
    dispatch(billingSubmit(cardNumber, cardCvc, cardExp));
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(Billing);

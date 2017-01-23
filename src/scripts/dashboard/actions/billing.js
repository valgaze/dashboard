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
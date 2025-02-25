export const Controller = {

  getDichargeReasonList(){
    return  `select * from tblListItems where ListType like 'DischargeReason'`;
  },

}

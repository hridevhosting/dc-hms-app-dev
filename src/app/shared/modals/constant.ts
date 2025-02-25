import { environment } from "src/environments/environment";

export var Constant = {
  // Api Web Site Url.
  apiUrl: updateApiUrl(),

  // Controller name with values.
  userController: 'user',
  employeeController: 'employee',
  sqlController: 'sql',
  listController: 'list',

  // Controller function name list with values.
  sqlFunNameList: {
    select: 'getdataset',
    update: 'excute'
  },

  userFunNameList: {
    validateUser: 'ValidateUser',
    getUserDetailsByUserId: 'GetUser'
  },

  commonList: {
    getDetails: 'GetListItem',
    getList: 'GetList',
    saveDetails: 'SaveListItem'
  },

}

function updateApiUrl() {
  // console.log(environment.httpProtocol + '://' + environment.ipAddress + ':' + environment.port + '/api/' );
  return environment.httpProtocol + '://' + environment.ipAddress + ':' + environment.port + '/api/'
}

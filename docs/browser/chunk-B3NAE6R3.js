import{b as o,c as m}from"./chunk-5JUHOLWQ.js";import{g as a}from"./chunk-3RSPD7AX.js";import{z as n}from"./chunk-N4ANQEKW.js";import{Q as s,V as i}from"./chunk-ZPID5U3R.js";var g=(()=>{class r{constructor(t,e,l){this._httpClient=t,this._commonService=e,this._router=l}login(t){let e=this._commonService.generateApiRequestParam(o.userFunNameList.validateUser,t);return this._httpClient.post(o.apiUrl+o.userController,e)}logout(){sessionStorage.removeItem("user"),this._router.navigate(["auth/login"])}validateUserSession(){let t=sessionStorage.getItem("user")||null,e=!1;return t?(t=JSON.parse(sessionStorage.getItem("user")||""),t.UserId>0&&(e=!0),e):e}static{this.\u0275fac=function(e){return new(e||r)(i(n),i(m),i(a))}}static{this.\u0275prov=s({token:r,factory:r.\u0275fac,providedIn:"root"})}}return r})();export{g as a};

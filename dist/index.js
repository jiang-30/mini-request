function e(e,t,s={}){let a=function(e){return/(http|https):\/\/([\w.]+\/?)\S*/.test(e)}(t)?t:`${e}${t}`;if(0!==Object.keys(s).length){const e=function(e){let t="";return Object.keys(e).forEach((function(s){t+=s+"="+encodeURIComponent(e[s])+"&"})),t.substring(0,t.length-1)}(s);a+=a.includes("?")?"&"+e:"?"+e}return a}export default class{constructor(e={}){let t={};t.baseUrl=e.baseUrl||"",t.method=e.method||"GET",t.dataType=e.dataType||"json",t.responseType=e.responseType||"text",t.fileName=e.fileName||"file",t.showLoading=e.showLoading||!1,t.header={"Content-Type":"application/json",...e.header},t.custom=e.custom||{},this.defaults=t,this.interceptor={request:e=>{e&&(this._requestBeforeFun=e)},response:(e,t)=>{e&&(this._requestComFun=e),t&&(this._requestComFail=t)}}}_requestBeforeFun(e,t){return e}_requestComFun(e){return e}_requestComFail(e){return e}validateStatus(e){return 200===e}get(e,t={},s={}){return this.request(Object.assign({method:"GET",url:e,params:t},s))}post(e,t={},s){return this.request(Object.assign({method:"POST",url:e,data:t},s))}upload(e,t,s={}){return s.header=s.header||{},s.header["Content-Type"]="multipart/form-data",this.uploadFile(Object.assign({url:e,filePath:t},s))}download(){}request(e){return this.handler(e,(e,t,s)=>{const a=wx.request({url:e.path,data:e.data,header:e.header,method:e.method,dataType:e.dataType,responseType:e.responseType,complete:a=>{this.handlerResult(a,e,t,s)}});e.getTask&&e.getTask(a,e)})}uploadFile(e){return this.handler(e,(e,t,s)=>{const a=wx.uploadFile({url:e.path,filePath:e.filePath,name:e.fileName,formData:e.data,header:e.header,complete:a=>{"json"==e.dataType&&(a.data=JSON.parse(a.data)),this.handlerResult(a,e,t,s)}});e.getTask&&e.getTask(a,e),e.onUploadProgress&&a.onProgressUpdate(e.onUploadProgress)})}downLoadFile(e){}handler(t,s){let a={};return a.baseUrl=this.defaults.baseUrl,a.method=t.method||this.defaults.method,a.url=t.url||"",a.params=t.params||{},a.data=t.data||{},a.header=Object.assign({},this.defaults.header,t.header||{}),a.dataType=t.dataType||this.defaults.dataType,a.responseType=t.responseType||this.defaults.responseType,a.timeout=t.timeout||this.defaults.timeout,a.filePath=t.filePath||"",a.fileName=t.fileName||this.defaults.fileName,a.onUploadProgress=t.onUploadProgress,a.getTask=t.getTask||this.defaults.getTask,a.showLoading=t.showLoading||this.defaults.showLoading,a.custom=Object.assign({},this.defaults.custom,t.custom||{}),new Promise((t,r)=>{let o=!0;const n=this._requestBeforeFun(a,(e="handle cancel",t=a)=>{r({errMsg:e,config:t}),o=!1});o&&(n.showLoading&&wx.showLoading({title:"加载中..."}),n.path=e(n.baseUrl,n.url,n.params),s(n,t,r))})}handlerResult(e,t,s,a){e.config=t,this.validateStatus(e.statusCode)?(e=this._requestComFun(e),Promise.resolve().then(()=>e).then(e=>s(e)).catch(e=>a(e))):(e=this._requestComFail(e),a(e)),t.showLoading&&wx.hideLoading()}}

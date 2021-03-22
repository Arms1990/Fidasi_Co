(this["webpackJsonpback-office"]=this["webpackJsonpback-office"]||[]).push([[2],{114:function(e,t,a){"use strict";var s=a(1),n=a.n(s),o=a(115),r=a(120);class i extends n.a.Component{constructor(e){super(e),this.state={notifications:[]},this.componentWillUnmount=()=>{o.a.removeChangeListener(this.handleStoreChange)},this.handleStoreChange=e=>{this.setState({notifications:e})},this.handleRequestHide=e=>{o.a.remove(e)},o.a.addChangeListener(this.handleStoreChange)}render(){const e=this.state.notifications,t=this.props,a=t.enterTimeout,s=t.leaveTimeout;return n.a.createElement(r.a,{enterTimeout:a,leaveTimeout:s,notifications:e,onRequestHide:this.handleRequestHide})}}i.defaultProps={enterTimeout:400,leaveTimeout:400},t.a=i},115:function(e,t,a){"use strict";var s=a(433);const n="change",o="primary",r="secondary",i="info",c="success",l="warning",u="error";class m extends s.EventEmitter{constructor(){super(),this.listNotify=[]}create(e){const t={id:"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}),type:"info",title:null,message:null,timeOut:5e3,customClassName:""};e.priority?this.listNotify.unshift(Object.assign(t,e)):this.listNotify.push(Object.assign(t,e)),this.emitChange()}primary(e,t,a,s,n,r){this.create({type:o,message:e,title:t,timeOut:a,onClick:s,priority:n,customClassName:r})}secondary(e,t,a,s,n,o){this.create({type:r,message:e,title:t,timeOut:a,onClick:s,priority:n,customClassName:o})}info(e,t,a,s,n,o){this.create({type:i,message:e,title:t,timeOut:a,onClick:s,priority:n,customClassName:o})}success(e,t,a,s,n,o){this.create({type:c,message:e,title:t,timeOut:a,onClick:s,priority:n,customClassName:o})}warning(e,t,a,s,n,o){this.create({type:l,message:e,title:t,timeOut:a,onClick:s,priority:n,customClassName:o})}error(e,t,a,s,n,o){this.create({type:u,message:e,title:t,timeOut:a,onClick:s,priority:n,customClassName:o})}remove(e){this.listNotify=this.listNotify.filter(t=>e.id!==t.id),this.emitChange()}emitChange(){this.emit(n,this.listNotify)}addChangeListener(e){this.addListener(n,e)}removeChangeListener(e){this.removeListener(n,e)}}t.a=new m},120:function(e,t,a){"use strict";var s=a(1),n=a.n(s),o=a(832),r=a(827),i=a(85),c=a.n(i);class l extends n.a.Component{constructor(...e){super(...e),this.componentDidMount=()=>{const e=this.props.timeOut;0!==e&&(this.timer=setTimeout(this.requestHide,e))},this.componentWillUnmount=()=>{this.timer&&clearTimeout(this.timer)},this.handleClick=()=>{const e=this.props.onClick;e&&e(),this.requestHide()},this.requestHide=()=>{const e=this.props.onRequestHide;e&&e()}}render(){const e=this.props,t=e.type,a=e.message;let s=this.props.title;const o=c()(["notification","notification-".concat(t),this.props.customClassName]);return s=s?n.a.createElement("h4",{className:"title"},s):null,n.a.createElement("div",{className:o,onClick:this.handleClick},n.a.createElement("div",{className:"notification-message",role:"alert"},s,n.a.createElement("div",{className:"message"},a)))}}l.defaultProps={type:"info",title:null,message:null,timeOut:5e3,onClick:()=>{},onRequestHide:()=>{},customClassName:""};var u=l;class m extends n.a.Component{constructor(...e){super(...e),this.handleRequestHide=e=>()=>{const t=this.props.onRequestHide;t&&t(e)}}render(){const e=this.props,t=e.notifications,a=e.enterTimeout,s=e.leaveTimeout,i=c()("notification-container",{"notification-container-empty":0===t.length});return n.a.createElement("div",{className:i},n.a.createElement(o.a,null,t.map(e=>{const t=e.id||(new Date).getTime();return n.a.createElement(r.a,{classNames:"notification",key:t,timeout:{exit:s,enter:a}},n.a.createElement(u,{key:t,type:e.type,title:e.title,message:e.message,timeOut:e.timeOut,onClick:e.onClick,onRequestHide:this.handleRequestHide(e),customClassName:e.customClassName}))})))}}m.defaultProps={notifications:[],onRequestHide:()=>{},enterTimeout:400,leaveTimeout:400};t.a=m},280:function(e,t){e.exports={"general.copyright":"Back Office &copy; 2020 &bull; All Rights Reserved.","user.login-title":"Login","user.register":"Register","user.forgot-password":"Forgot Password","user.reset-password":"Reset Password","user.email":"User ID","user.password":"Password","user.new-password":"New Password","user.new-password-again":"New Password Again","user.forgot-password-question":"Forget password?","user.login-question":"Remember your password? Login now!","user.fullname":"Full Name","user.login-button":"LOGIN","user.register-button":"REGISTER","user.reset-password-button":"RESET","user.buy":"BUY","user.username":"Username","menu.app":"Home","menu.dashboards":"Dashboards","menu.gogo":"Gogo","menu.start":"Start","menu.dashboard":"Dashboard","menu.onboarding":"Onboarding","menu.servizi":"Servizi","menu.feedback":"Feedback","menu.profile":"Profile","menu.users":"Users","menu.roles":"Roles","menu.rules":"Rules","menu.processConfigs":"Configuration","menu.clients":"Clients","menu.pages":"Pages","menu.menuItems":"Menu","menu.test_01":"Test","menu.test_02":"Test 02","menu.test_03":"Test 03","menu.second-menu":"Second Menu","menu.second":"Second","menu.ui":"UI","menu.charts":"Charts","menu.chat":"Chat","menu.survey":"Survey","menu.todo":"Todo","menu.search":"Search","menu.docs":"Docs","menu.blank-page":"Blank Page","profile.about":"About","pages.error-title":"Ooops... looks like an error occurred!","pages.error-code":"Error code","pages.go-back-home":"GO BACK HOME","pages.orderby":"Order By "}},415:function(e,t){},423:function(e,t){},430:function(e,t){},432:function(e,t){e.exports={"general.copyright":"Gogo React \xa9 Todos los derechos reservados.","user.login-title":"Iniciar sesi\xf3n","user.register":"Registro","user.forgot-password":"Se te olvid\xf3 tu contrase\xf1a","user.email":"Email","user.password":"Contrase\xf1a","user.forgot-password-question":"\xbfContrase\xf1a olvidada?","user.fullname":"Nombre completo","user.login-button":"INICIAR SESI\xd3N","user.register-button":"REGISTRO","user.reset-password-button":"REINICIAR","user.buy":"COMPRAR","user.username":"Nombre de Usuario","menu.app":"Inicio","menu.dashboards":"Tableros","menu.gogo":"Gogo","menu.start":"Comienzo","menu.second-menu":"Segundo men\xfa","menu.second":"Segundo","menu.ui":"IU","menu.charts":"Gr\xe1ficos","menu.chat":"Chatea","menu.survey":"Encuesta","menu.todo":"Notas","menu.search":"B\xfasqueda","menu.docs":"Docs","menu.blank-page":"Blank Page","pages.error-title":"Vaya, parece que ha ocurrido un error!","pages.error-code":"C\xf3digo de error","pages.go-back-home":"REGRESAR A INICIO"}},823:function(e,t,a){"use strict";a.r(t);var s=a(409),n=a(1),o=a.n(n),r=a(23),i=a(96),c=a(89),l=a(103),u=a(5),m=a(279),d=a.n(m),h=a(280),p=a.n(h);var g={messages:Object(u.a)({},p.a),locale:"en-US",data:d.a},f=a(431),b=a.n(f),E=a(432),C=a.n(E);const y={en:g,es:{messages:Object(u.a)({},C.a),locale:"es-ES",data:b.a},enrtl:{messages:Object(u.a)({},p.a),locale:"en-US",data:d.a}};Object(l.c)(y.en.data),Object(l.c)(y.es.data),Object(l.c)(y.enrtl.data);var k=y,v=a(16),x=a.n(v),N=a(8),R=a(789),O=a(790),w=a(830);class S extends n.Component{constructor(e){super(),this.getContainer=()=>x.a.findDOMNode(this),this.toggle=e=>{e.preventDefault();const t=this.state.isOpen;t?this.removeEvents():this.addEvents(),this.setState({isOpen:!t})},this.changeThemeColor=(e,t)=>{e.preventDefault(),localStorage.setItem(N.k,t),this.toggle(e),setTimeout(()=>{window.location.reload()},500)},this.addEvents=()=>{["click","touchstart"].forEach(e=>document.addEventListener(e,this.handleDocumentClick,!0))},this.removeEvents=()=>{["click","touchstart"].forEach(e=>document.removeEventListener(e,this.handleDocumentClick,!0))},this.handleDocumentClick=e=>{const t=this.getContainer();t.contains(e.target)||t===e.target||this.toggle(e)},this.changeRadius=e=>{"flat"===e?document.body.classList.remove("rounded"):document.body.classList.add("rounded"),this.setState({radius:e}),localStorage.setItem(N.l,e)},this.state={isOpen:!1,selectedColor:localStorage.getItem(N.k),radius:localStorage.getItem(N.l)||"rounded"},this.removeEvents()}componentDidMount(){this.changeRadius(this.state.radius)}render(){const e=this.state,t=e.selectedColor,a=e.radius;return o.a.createElement("div",{className:"theme-colors ".concat(this.state.isOpen?"shown":"")},o.a.createElement("div",{className:"p-4"},o.a.createElement("p",{className:"text-muted mb-2"},"Light Theme"),o.a.createElement("div",{className:"d-flex flex-row justify-content-between mb-4"},["purple","blue","green","orange","red"].map(e=>o.a.createElement("a",{key:"light.".concat(e),href:"#light.".concat(e),className:"theme-color theme-color-".concat(e," ").concat(t==="light.".concat(e)?"active":""),onClick:t=>this.changeThemeColor(t,"light.".concat(e))},o.a.createElement("span",null,"`light.$",e,"`")))),o.a.createElement("p",{className:"text-muted mb-2"},"Dark Theme"),o.a.createElement("div",{className:"d-flex flex-row justify-content-between"},["purple","blue","green","orange","red"].map(e=>o.a.createElement("a",{key:"dark.".concat(e),href:"#dark.".concat(e),className:"theme-color theme-color-".concat(e," ").concat(t==="dark.".concat(e)?"active":""),onClick:t=>this.changeThemeColor(t,"dark.".concat(e))},o.a.createElement("span",null,"`dark.$",e,"`"))))),o.a.createElement("div",{className:" pb-0 pl-4 pt-4"},o.a.createElement(R.a,null,o.a.createElement(O.a,{for:"radiusRadio"},"Border Radius "),o.a.createElement("div",null,o.a.createElement(w.a,{type:"radio",name:"radiusRadio",id:"rounded",label:"Rounded",inline:!0,defaultChecked:"rounded"===a,onChange:()=>this.changeRadius("rounded")}),o.a.createElement(w.a,{type:"radio",name:"radiusRadio",id:"flat",label:"Flat",inline:!0,defaultChecked:"flat"===a,onChange:()=>this.changeRadius("flat")})))),o.a.createElement("a",{href:"#section",className:"theme-button",onClick:this.toggle}," ",o.a.createElement("i",{className:"simple-icon-magic-wand"})," "))}}var T=S,I=a(114),U=a(17);const q=o.a.lazy(()=>a.e(11).then(a.bind(null,791))),L=o.a.lazy(()=>Promise.all([a.e(0),a.e(1),a.e(15),a.e(12)]).then(a.bind(null,824))),j=o.a.lazy(()=>a.e(14).then(a.bind(null,828))),D=o.a.lazy(()=>a.e(13).then(a.bind(null,818))),H=e=>{let t=e.component,a=e.authUser,n=e.token,r=Object(s.a)(e,["component","authUser","token"]);return o.a.createElement(i.b,Object.assign({},r,{render:e=>a||n?o.a.createElement(t,e):o.a.createElement(i.a,{to:{pathname:"/user/login",state:{from:e.location}}})}))},P=e=>{let t=e.component,a=e.authUser,n=e.token,r=Object(s.a)(e,["component","authUser","token"]);return o.a.createElement(i.b,Object.assign({},r,{render:e=>a&&n?o.a.createElement(i.a,{to:{pathname:"/app",state:{from:e.location}}}):o.a.createElement(t,e)}))};class A extends n.Component{constructor(e){super(e);Object(U.b)().isRtl?(document.body.classList.add("rtl"),document.body.classList.remove("ltr")):(document.body.classList.add("ltr"),document.body.classList.remove("rtl"))}render(){const e=this.props,t=e.locale,a=e.token,s=e.loginUser,r=k[t];return o.a.createElement("div",{className:"h-100"},o.a.createElement(l.b,{locale:r.locale,messages:r.messages},o.a.createElement(o.a.Fragment,null,o.a.createElement(I.a,null),N.g&&o.a.createElement(T,null),o.a.createElement(n.Suspense,{fallback:o.a.createElement("div",{className:"loading"})},o.a.createElement(c.a,null,o.a.createElement(i.d,null,o.a.createElement(H,{path:"/app",authUser:s,token:a,component:L}),o.a.createElement(P,{path:"/user",token:a,authUser:s,component:j}),o.a.createElement(i.b,{path:"/error",exact:!0,render:e=>o.a.createElement(D,e)}),o.a.createElement(i.b,{path:"/",exact:!0,render:e=>o.a.createElement(q,e)}),o.a.createElement(i.a,{to:"/error"})))))))}}t.default=Object(r.b)(({authUser:e,settings:t})=>({loginUser:e.user,token:e.token,locale:t.locale}),{})(A)}}]);
//# sourceMappingURL=App.f450d84a.chunk.js.map
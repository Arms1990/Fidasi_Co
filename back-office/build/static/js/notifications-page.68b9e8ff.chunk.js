(this["webpackJsonpback-office"]=this["webpackJsonpback-office"]||[]).push([[5],{819:function(e,t,n){"use strict";n.r(t);var a=n(4),o=n.n(a),i=n(15),r=n(1),c=n.n(r),s=n(16),l=n.n(s),d=n(341),u=n(804),m=n(342),p=n(96),f=n(23),h=n(95),b=n(107),g=n.n(b),k=(n(285),n(286)),w=n.n(k),E=n(85),y=n.n(E),x=n(204),v=n(98),N=n(284),L=n.n(N),U=n(187),S=n.n(U),j=n(17);window.io=w()({path:"".concat("http","://").concat("80.211.143.248",":").concat("2000")});const R=({token:e,loginUser:t,baseURL:n,webSocketURL:a,isLast:r,clientID:s,clientSecret:d,id:u,image:m,message:p,payload:f,data_creation:b,action:k,type:w,seen:E,created_at:N})=>{const U=function(){var r=Object(i.a)(o.a.mark((function i(r,u){return o.a.wrap((function(o){for(;;)switch(o.prev=o.next){case 0:return r.preventDefault(),o.next=3,Object(j.a)("".concat(a,"/notification/").concat(u),{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer ".concat(e)}}).then(e=>e.ok?e.json():e.json().then(e=>{throw new Error(e.message)})).then(a=>{const o=a.url,i=a.type,r=a.resourceURI;if(i){if("externalLink"===i&&window.open(o,"_blank"),"file"===i)return L.a.saveAs(r);if("modal"===i){let o=a.components.map((a,o)=>{const i=a.type,r=a.slug;if("datatable"===i)return c.a.createElement(x.f,{slug:r,token:e,user:t,clientSecret:d,baseURL:n,clientID:s,identifier:a.id,key:o,component:a});if("ddl"===i)return c.a.createElement(x.e,{slug:r,token:e,user:t,clientSecret:d,baseURL:n,clientID:s,identifier:a.id,key:o,component:a});if("card"===i)return c.a.createElement(x.d,{slug:r,token:e,user:t,clientSecret:d,baseURL:n,clientID:s,identifier:a.id,key:o,component:a});if("wizard"===i)return c.a.createElement(v.a,{slug:r,token:e,user:t,clientSecret:d,baseURL:n,clientID:s,identifier:a.id,key:o,component:a});if("productCardList"===i)return c.a.createElement(x.l,{slug:r,token:e,user:t,clientSecret:d,baseURL:n,clientID:s,identifier:a.id,key:o,component:a});if("productList"===i)return c.a.createElement(x.n,{slug:r,token:e,user:t,clientSecret:d,baseURL:n,clientID:s,identifier:a.id,key:o,component:a});if("chart"===i){const e=a.kind;return"pie"===e?c.a.createElement("div",{key:o},c.a.createElement(x.k,{shadow:!0,component:a})):"bar"===e?c.a.createElement("div",{key:o},c.a.createElement(x.b,{shadow:!0,component:a})):"area"===e?c.a.createElement("div",{key:o},c.a.createElement(x.a,{shadow:!0,component:a})):"line"===e?c.a.createElement("div",{key:o},c.a.createElement(x.j,{shadow:!0,component:a})):"doughnut"===e?c.a.createElement("div",{key:o},c.a.createElement(x.g,{shadow:!0,component:a})):c.a.createElement("div",{key:o},c.a.createElement(x.a,{shadow:!0,component:a}))}return"calendar"===i?c.a.createElement(x.c,{slug:r,token:e,user:t,clientSecret:d,baseURL:n,clientID:s,identifier:a.id,key:o,component:a}):"table"===i?c.a.createElement(x.q,{slug:r,token:e,user:t,clientSecret:d,baseURL:n,clientID:s,identifier:a.id,key:o,component:a}):null}),i=S.a.dialog({message:'<div class="loading" />',closeButton:!1,backdrop:!0,centerVertical:!0,onEscape:!0,scrollable:!0,size:"extra-large"});i.init((function(){let e=i.find(".modal-content").addClass("modal-dialog-centered modal-dialog-scrollable").find(".modal-body").addClass("w-100").find(".bootbox-body");return l.a.render(o,e[0])}))}}}).catch(e=>h.a.error(e.message,"Notification Error",3e3,null,null,""));case 3:return o.abrupt("return",o.sent);case 4:case"end":return o.stop()}}),i)})));return function(e,t){return r.apply(this,arguments)}}(),R=g()(g.a.utc(b).toDate()).local().fromNow();return c.a.createElement("a",{href:"/",onClick:e=>U(e,u),className:y()("scrollbar-notification-item","d-flex","flex-row","py-3",{"bg-light":"N"===E},{"mb-2":!r},{"border-bottom":"S"===E&&!r})},c.a.createElement("div",{className:"pl-3 pr-2"},c.a.createElement("p",{className:"font-weight-medium mb-0"},p),c.a.createElement("p",{className:"text-muted mb-0 text-small"},R)))};class D extends r.Component{constructor(...e){var t;super(...e),t=this,this.state={loadingNotifications:!1,notifications:[],nextPageURL:null,dropdownOpened:!1},this.getNotifications=Object(i.a)(o.a.mark((function e(){var n,a,i,r,c,s;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.props,a=n.token,n.baseURL,i=n.webSocketURL,r=n.logoutUser,c=n.history,s=n.clientID,e.next=3,Object(j.a)("".concat(i,"/notifications?client_id=").concat(s),{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer ".concat(a)}}).then(e=>e.ok?e.json():r(c)).then(e=>t.setState({nextPageURL:e.nextPageURL,notifications:e.notifications,loadingNotifications:!1})).catch(e=>console.error(e));case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)}))),this.renderNotifications=e=>{if(0===e.length)return c.a.createElement("div",{className:"scrollbar-notification-item w-100 d-flex flex-row justify-content-center align-items-center mb-3 py-0 px-4"},c.a.createElement("p",{className:"font-weight-medium font-italic mb-0"},"No notification"));let t=e.filter(e=>"N"===e.seen);t=t.map((e,n)=>c.a.createElement(R,Object.assign({key:n,isLast:t.length-1===n},this.props,e)));let n=e.filter(e=>"S"===e.seen);n=n.map((e,t)=>c.a.createElement(R,Object.assign({key:t,isLast:n.length-1===t},this.props,e)));const a=c.a.createElement("div",{key:"new_notification_header",className:"w-100 d-flex flex-row justify-content-start pb-2 px-2 mb-2 border-bottom"},c.a.createElement("h6",null,"New")),o=c.a.createElement("div",{key:"earlier_notification_header",className:"w-100 d-flex flex-row justify-content-start pb-2 pt-3 px-2 mb-2 border-bottom"},c.a.createElement("h6",null,"Earlier"));let i=[];return t.length>0&&i.push(a),i=[...i,...t],n.length>0&&i.push(o),i=[...i,...n],i}}componentWillUnmount(){window.removeEventListener("scroll",()=>this.loadMoreNotifications(),!1)}componentDidMount(){var e=this;return Object(i.a)(o.a.mark((function t(){var n,a,i,r,c,s;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getNotifications();case 2:window.addEventListener("scroll",()=>e.loadMoreNotifications(),!1),n=e.props,a=n.loginUser,i=n.token,r=n.webSocketURL,c="string"===typeof a?JSON.parse(a):a,"undefined"!==typeof w.a&&((s=w()(r,{extraHeaders:{"x-auth-token":i},transportOptions:{polling:{extraHeaders:{"x-auth-token":i}}}})).on("error",(function(e){throw new Error(e)})),s.on("private.notifications.User.".concat(c.id),t=>{const n=e.state.notifications;return e.setState({notifications:[...n,t]})}));case 6:case"end":return t.stop()}}),t)})))()}getVerticalScrollPercentage(e){var t=e.parentNode;return(e.scrollTop||t.scrollTop)/(t.scrollHeight-t.clientHeight)*100}loadMoreNotifications(){var e=this;return Object(i.a)(o.a.mark((function t(){var n,a,i,r,c,s,l;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.props,a=n.token,i=n.clientID,r=e.state,c=r.nextPageURL,s=r.notifications,l=r.loadingNotifications,!(e.getVerticalScrollPercentage(document.body)>70)){t.next=9;break}if(l||null===c){t.next=9;break}return e.setState({loadingNotifications:!0}),t.next=8,Object(j.a)("".concat(c,"&client_id=").concat(i),{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer ".concat(a)}}).then(e=>e.json()).then(t=>{e.setState({nextPageURL:t.nextPageURL,notifications:[...s,...t.notifications],loadingNotifications:!1})}).catch(e=>console.error(e));case 8:return t.abrupt("return",t.sent);case 9:case"end":return t.stop()}}),t)})))()}render(){const e=this.state,t=e.notifications,n=e.loadingNotifications,a=t.sort((e,t)=>g()(t.created_at).isAfter(g()(e.created_at)));return document.title="Notifications | Back Office",document.body.classList.add("rounded"),c.a.createElement(r.Fragment,null,c.a.createElement(d.a,null,c.a.createElement(u.a,null,c.a.createElement(m.a,null,"Notifications"),c.a.createElement("div",null,this.renderNotifications(a)),n?c.a.createElement("div",{className:"text-center mt-4 py-1"},c.a.createElement("div",{className:"loading position-static"})):null)))}}t.default=Object(p.g)(Object(f.b)(({authUser:e,menu:t})=>{const n=t.containerClassnames;return{token:e.token,baseURL:e.baseURL,webSocketURL:e.webSocketURL,clientID:e.clientID,clientSecret:e.clientSecret,loginUser:e.user,containerClassnames:n}},{})(D))}}]);
//# sourceMappingURL=notifications-page.68b9e8ff.chunk.js.map
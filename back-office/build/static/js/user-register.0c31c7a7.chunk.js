(this["webpackJsonpback-office"]=this["webpackJsonpback-office"]||[]).push([[9],{212:function(e,a,t){"use strict";var s=t(10),n=t(14),r=t(94),o=t(90),i=t(1),l=t.n(i),c=t(33),u=t.n(c),m=t(85),d=t.n(m),f=t(86),b={active:u.a.bool,"aria-label":u.a.string,block:u.a.bool,color:u.a.string,disabled:u.a.bool,outline:u.a.bool,tag:f.q,innerRef:u.a.oneOfType([u.a.object,u.a.func,u.a.string]),onClick:u.a.func,size:u.a.string,children:u.a.node,className:u.a.string,cssModule:u.a.object,close:u.a.bool},p=function(e){function a(a){var t;return(t=e.call(this,a)||this).onClick=t.onClick.bind(Object(r.a)(t)),t}Object(o.a)(a,e);var t=a.prototype;return t.onClick=function(e){if(!this.props.disabled)return this.props.onClick?this.props.onClick(e):void 0;e.preventDefault()},t.render=function(){var e=this.props,a=e.active,t=e["aria-label"],r=e.block,o=e.className,i=e.close,c=e.cssModule,u=e.color,m=e.outline,b=e.size,p=e.tag,g=e.innerRef,h=Object(n.a)(e,["active","aria-label","block","className","close","cssModule","color","outline","size","tag","innerRef"]);i&&"undefined"===typeof h.children&&(h.children=l.a.createElement("span",{"aria-hidden":!0},"\xd7"));var v="btn"+(m?"-outline":"")+"-"+u,j=Object(f.m)(d()(o,{close:i},i||"btn",i||v,!!b&&"btn-"+b,!!r&&"btn-block",{active:a,disabled:this.props.disabled}),c);h.href&&"button"===p&&(p="a");var N=i?"Close":null;return l.a.createElement(p,Object(s.a)({type:"button"===p&&h.onClick?"button":void 0},h,{className:j,ref:g,onClick:this.onClick,"aria-label":t||N}))},a}(l.a.Component);p.propTypes=b,p.defaultProps={color:"secondary",tag:"button"},a.a=p},334:function(e,a,t){"use strict";var s=t(10),n=t(14),r=t(1),o=t.n(r),i=t(33),l=t.n(i),c=t(85),u=t.n(c),m=t(86),d=l.a.oneOfType([l.a.number,l.a.string]),f=l.a.oneOfType([l.a.bool,l.a.number,l.a.string,l.a.shape({size:l.a.oneOfType([l.a.bool,l.a.number,l.a.string]),order:d,offset:d})]),b={tag:m.q,xs:f,sm:f,md:f,lg:f,xl:f,className:l.a.string,cssModule:l.a.object,widths:l.a.array},p={tag:"div",widths:["xs","sm","md","lg","xl"]},g=function(e,a,t){return!0===t||""===t?e?"col":"col-"+a:"auto"===t?e?"col-auto":"col-"+a+"-auto":e?"col-"+t:"col-"+a+"-"+t},h=function(e){var a=e.className,t=e.cssModule,r=e.widths,i=e.tag,l=Object(n.a)(e,["className","cssModule","widths","tag"]),c=[];r.forEach((function(a,s){var n=e[a];if(delete l[a],n||""===n){var r=!s;if(Object(m.k)(n)){var o,i=r?"-":"-"+a+"-",d=g(r,a,n.size);c.push(Object(m.m)(u()(((o={})[d]=n.size||""===n.size,o["order"+i+n.order]=n.order||0===n.order,o["offset"+i+n.offset]=n.offset||0===n.offset,o)),t))}else{var f=g(r,a,n);c.push(f)}}})),c.length||c.push("col");var d=Object(m.m)(u()(a,c),t);return o.a.createElement(i,Object(s.a)({},l,{className:d}))};h.propTypes=b,h.defaultProps=p,a.a=h},335:function(e,a,t){"use strict";var s=t(10),n=t(14),r=t(1),o=t.n(r),i=t(33),l=t.n(i),c=t(85),u=t.n(c),m=t(86),d=l.a.oneOfType([l.a.number,l.a.string]),f={tag:m.q,noGutters:l.a.bool,className:l.a.string,cssModule:l.a.object,form:l.a.bool,xs:d,sm:d,md:d,lg:d,xl:d},b={tag:"div",widths:["xs","sm","md","lg","xl"]},p=function(e){var a=e.className,t=e.cssModule,r=e.noGutters,i=e.tag,l=e.form,c=e.widths,d=Object(n.a)(e,["className","cssModule","noGutters","tag","form","widths"]),f=[];c.forEach((function(a,t){var s=e[a];if(delete d[a],s){var n=!t;f.push(n?"row-cols-"+s:"row-cols-"+a+"-"+s)}}));var b=Object(m.m)(u()(a,r?"no-gutters":null,l?"form-row":"row",f),t);return o.a.createElement(i,Object(s.a)({},d,{className:b}))};p.propTypes=f,p.defaultProps=b,a.a=p},341:function(e,a,t){"use strict";var s=t(10),n=t(14),r=t(1),o=t.n(r),i=t(33),l=t.n(i),c=t(85),u=t.n(c),m=t(86),d={tag:m.q,inverse:l.a.bool,color:l.a.string,body:l.a.bool,outline:l.a.bool,className:l.a.string,cssModule:l.a.object,innerRef:l.a.oneOfType([l.a.object,l.a.string,l.a.func])},f=function(e){var a=e.className,t=e.cssModule,r=e.color,i=e.body,l=e.inverse,c=e.outline,d=e.tag,f=e.innerRef,b=Object(n.a)(e,["className","cssModule","color","body","inverse","outline","tag","innerRef"]),p=Object(m.m)(u()(a,"card",!!l&&"text-white",!!i&&"card-body",!!r&&(c?"border":"bg")+"-"+r),t);return o.a.createElement(d,Object(s.a)({},b,{className:p,ref:f}))};f.propTypes=d,f.defaultProps={tag:"div"},a.a=f},342:function(e,a,t){"use strict";var s=t(10),n=t(14),r=t(1),o=t.n(r),i=t(33),l=t.n(i),c=t(85),u=t.n(c),m=t(86),d={tag:m.q,className:l.a.string,cssModule:l.a.object},f=function(e){var a=e.className,t=e.cssModule,r=e.tag,i=Object(n.a)(e,["className","cssModule","tag"]),l=Object(m.m)(u()(a,"card-title"),t);return o.a.createElement(r,Object(s.a)({},i,{className:l}))};f.propTypes=d,f.defaultProps={tag:"div"},a.a=f},782:function(e,a,t){"use strict";var s=t(10),n=t(14),r=t(94),o=t(90),i=t(1),l=t.n(i),c=t(33),u=t.n(c),m=t(85),d=t.n(m),f=t(86),b={children:u.a.node,type:u.a.string,size:u.a.oneOfType([u.a.number,u.a.string]),bsSize:u.a.string,valid:u.a.bool,invalid:u.a.bool,tag:f.q,innerRef:u.a.oneOfType([u.a.object,u.a.func,u.a.string]),plaintext:u.a.bool,addon:u.a.bool,className:u.a.string,cssModule:u.a.object},p=function(e){function a(a){var t;return(t=e.call(this,a)||this).getRef=t.getRef.bind(Object(r.a)(t)),t.focus=t.focus.bind(Object(r.a)(t)),t}Object(o.a)(a,e);var t=a.prototype;return t.getRef=function(e){this.props.innerRef&&this.props.innerRef(e),this.ref=e},t.focus=function(){this.ref&&this.ref.focus()},t.render=function(){var e=this.props,a=e.className,t=e.cssModule,r=e.type,o=e.bsSize,i=e.valid,c=e.invalid,u=e.tag,m=e.addon,b=e.plaintext,p=e.innerRef,g=Object(n.a)(e,["className","cssModule","type","bsSize","valid","invalid","tag","addon","plaintext","innerRef"]),h=["radio","checkbox"].indexOf(r)>-1,v=new RegExp("\\D","g"),j=u||("select"===r||"textarea"===r?r:"input"),N="form-control";b?(N+="-plaintext",j=u||"input"):"file"===r?N+="-file":"range"===r?N+="-range":h&&(N=m?null:"form-check-input"),g.size&&v.test(g.size)&&(Object(f.s)('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.'),o=g.size,delete g.size);var O=Object(f.m)(d()(a,c&&"is-invalid",i&&"is-valid",!!o&&"form-control-"+o,N),t);return("input"===j||u&&"function"===typeof u)&&(g.type=r),g.children&&!b&&"select"!==r&&"string"===typeof j&&"select"!==j&&(Object(f.s)('Input with a type of "'+r+'" cannot have children. Please use "value"/"defaultValue" instead.'),delete g.children),l.a.createElement(j,Object(s.a)({},g,{ref:p,className:O,"aria-invalid":c}))},a}(l.a.Component);p.propTypes=b,p.defaultProps={type:"text"},a.a=p},829:function(e,a,t){"use strict";t.r(a);var s=t(1),n=t.n(s),r=t(335),o=t(341),i=t(342),l=t(10),c=t(14),u=t(94),m=t(90),d=t(33),f=t.n(d),b=t(85),p=t.n(b),g=t(86),h={children:f.a.node,inline:f.a.bool,tag:g.q,innerRef:f.a.oneOfType([f.a.object,f.a.func,f.a.string]),className:f.a.string,cssModule:f.a.object},v=function(e){function a(a){var t;return(t=e.call(this,a)||this).getRef=t.getRef.bind(Object(u.a)(t)),t.submit=t.submit.bind(Object(u.a)(t)),t}Object(m.a)(a,e);var t=a.prototype;return t.getRef=function(e){this.props.innerRef&&this.props.innerRef(e),this.ref=e},t.submit=function(){this.ref&&this.ref.submit()},t.render=function(){var e=this.props,a=e.className,t=e.cssModule,s=e.inline,r=e.tag,o=e.innerRef,i=Object(c.a)(e,["className","cssModule","inline","tag","innerRef"]),u=Object(g.m)(p()(a,!!s&&"form-inline"),t);return n.a.createElement(r,Object(l.a)({},i,{ref:o,className:u}))},a}(s.Component);v.propTypes=h,v.defaultProps={tag:"form"};var j=v,N=t(790),O=t(782),y=t(212),E=t(89),x=t(23),w=t(3),R=t(99),M=t(92);class k extends s.Component{constructor(e){super(e),this.state={email:"demo@gogo.com",password:"gogo123",name:"Sarah Kortney"}}onUserRegister(){""!==this.state.email&&""!==this.state.password&&this.props.history.push("/")}render(){return n.a.createElement(r.a,{className:"h-100"},n.a.createElement(M.a,{xxs:"12",md:"7",className:"mx-auto my-auto"},n.a.createElement(o.a,{className:"auth-card"},n.a.createElement("div",{className:"position-relative image-side "},n.a.createElement("p",{className:"text-white h2"},"MAGIC IS IN THE DETAILS"),n.a.createElement("p",{className:"white mb-0"},"Please use this form to register. ",n.a.createElement("br",null),"If you are a member, please"," ",n.a.createElement(E.b,{to:"/user/login",className:"white"},"login"),".")),n.a.createElement("div",{className:"form-side"},n.a.createElement(E.b,{to:"/",className:"white"},n.a.createElement("span",{className:"logo-single"})),n.a.createElement(i.a,{className:"mb-4"},n.a.createElement(R.a,{id:"user.register"})),n.a.createElement(j,null,n.a.createElement(N.a,{className:"form-group has-float-label mb-4"},n.a.createElement(O.a,{type:"name",defaultValue:this.state.name}),n.a.createElement(R.a,{id:"user.fullname"})),n.a.createElement(N.a,{className:"form-group has-float-label mb-4"},n.a.createElement(O.a,{type:"email",defaultValue:this.state.email}),n.a.createElement(R.a,{id:"user.email"})),n.a.createElement(N.a,{className:"form-group has-float-label mb-4"},n.a.createElement(O.a,{type:"password"}),n.a.createElement(R.a,{id:"user.password",defaultValue:this.state.password})),n.a.createElement("div",{className:"d-flex justify-content-end align-items-center"},n.a.createElement(y.a,{color:"primary",className:"btn-shadow",size:"lg",onClick:()=>this.onUserRegister()},n.a.createElement(R.a,{id:"user.register-button"}))))))))}}a.default=Object(x.b)(({authUser:e})=>({user:e.user,loading:e.loading}),{registerUser:w.E})(k)},92:function(e,a,t){"use strict";t.d(a,"a",(function(){return o})),t.d(a,"b",(function(){return i}));var s=t(1),n=t.n(s),r=t(334);const o=e=>n.a.createElement(r.a,Object.assign({},e,{widths:["xxs","xs","sm","md","lg","xl","xxl"]})),i=e=>n.a.createElement("div",{className:"separator ".concat(e.className)})},99:function(e,a,t){"use strict";var s=t(1),n=t.n(s),r=t(103);a.a=Object(r.d)(e=>n.a.createElement(r.a,e),{withRef:!1})}}]);
//# sourceMappingURL=user-register.0c31c7a7.chunk.js.map
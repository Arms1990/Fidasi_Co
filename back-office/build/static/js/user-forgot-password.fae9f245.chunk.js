(this["webpackJsonpback-office"]=this["webpackJsonpback-office"]||[]).push([[7],{821:function(e,a,t){"use strict";t.r(a);var s=t(1),r=t.n(s),o=t(335),l=t(341),n=t(342),c=t(789),i=t(790),m=t(212),u=t(89),d=t(139),p=t(92),f=t(99),E=t(3),h=t(95),g=t(23);class b extends s.Component{constructor(e){super(e),this.onForgotPassword=e=>{this.props.loading||""!==e.email&&this.props.forgotPassword(e,this.props.history)},this.validateEmail=e=>{let a;return e?/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e)||(a="Invalid email address"):a="Please enter your email address",a},this.state={email:""},this.formickRef=r.a.createRef()}componentDidUpdate(){this.props.error?h.a.warning(this.props.error,"Forgot Password Error",3e3,null,null,""):this.props.loading||"success"!==this.props.forgotUserMail||(this.formickRef&&this.formickRef.resetForm(),h.a.success(this.props.forgotUserMessage,"Forgot Password Success",3e3,null,null,""))}componentDidMount(){document.title="Forgot Password | Back Office"}render(){const e={email:this.state.email};return r.a.createElement(o.a,{className:"h-100"},r.a.createElement(p.a,{xxs:"12",md:"7",className:"mx-auto my-auto"},r.a.createElement(l.a,{className:"auth-card"},r.a.createElement("div",{className:"position-relative image-side "},r.a.createElement("p",{className:"text-white h2"},"MAGIC IS IN THE DETAILS"),r.a.createElement("p",{className:"white mb-0"},"Please use your e-mail to reset your password. ",r.a.createElement("br",null),"If you are not a member, please"," ",r.a.createElement(u.b,{to:"/register",className:"white"},"register"),".")),r.a.createElement("div",{className:"form-side"},r.a.createElement(u.b,{to:"/",className:"white"},r.a.createElement("span",{className:"logo-single"})),r.a.createElement(n.a,{className:"mb-4"},r.a.createElement(f.a,{id:"user.forgot-password"})),r.a.createElement(d.c,{ref:e=>this.formickRef=e,initialValues:e,onSubmit:this.onForgotPassword},({errors:e,touched:a})=>r.a.createElement(d.b,{className:"av-tooltip tooltip-label-bottom"},r.a.createElement(c.a,{className:"form-group has-float-label"},r.a.createElement(i.a,null,r.a.createElement(f.a,{id:"user.email"})),r.a.createElement(d.a,{className:"form-control",name:"email"}),e.email&&a.email&&r.a.createElement("div",{className:"invalid-feedback d-block"},e.email)),r.a.createElement("div",{className:"d-flex justify-content-between align-items-center"},r.a.createElement(u.b,{to:"/user/login"},r.a.createElement(f.a,{id:"user.login-question"})),r.a.createElement(m.a,{color:"primary",className:"btn-shadow btn-multiple-state ".concat(this.props.loading?"show-spinner":""),size:"lg"},r.a.createElement("span",{className:"spinner d-inline-block"},r.a.createElement("span",{className:"bounce1"}),r.a.createElement("span",{className:"bounce2"}),r.a.createElement("span",{className:"bounce3"})),r.a.createElement("span",{className:"label"},r.a.createElement(f.a,{id:"user.reset-password-button"}))))))))))}}a.default=Object(g.b)(({authUser:e})=>({forgotUserMail:e.forgotUserMail,forgotUserMessage:e.forgotUserMessage,loading:e.loading,error:e.error}),{forgotPassword:E.A})(b)},92:function(e,a,t){"use strict";t.d(a,"a",(function(){return l})),t.d(a,"b",(function(){return n}));var s=t(1),r=t.n(s),o=t(334);const l=e=>r.a.createElement(o.a,Object.assign({},e,{widths:["xxs","xs","sm","md","lg","xl","xxl"]})),n=e=>r.a.createElement("div",{className:"separator ".concat(e.className)})},95:function(e,a,t){"use strict";var s=t(120),r=(t(114),t(115));t.d(a,"a",(function(){return r.a}));s.a},99:function(e,a,t){"use strict";var s=t(1),r=t.n(s),o=t(103);a.a=Object(o.d)(e=>r.a.createElement(o.a,e),{withRef:!1})}}]);
//# sourceMappingURL=user-forgot-password.fae9f245.chunk.js.map
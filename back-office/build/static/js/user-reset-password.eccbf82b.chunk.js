(this["webpackJsonpback-office"]=this["webpackJsonpback-office"]||[]).push([[10],{822:function(e,a,s){"use strict";s.r(a);var t=s(1),r=s.n(t),n=s(335),o=s(341),c=s(342),l=s(789),i=s(790),m=s(212),d=s(89),w=s(96),p=s(139),u=s(92),h=s(99),P=s(3),E=s(95),f=s(23);class g extends t.Component{constructor(e){super(e),this.onResetPassword=e=>{if(!this.props.loading){const a=new URLSearchParams(this.props.location.search).get("oobCode");a?""!==e.newPassword&&this.props.resetPassword({newPassword:e.newPassword,resetPasswordCode:a,history:this.props.history}):E.a.warning("Please check your email URL.","Reset Password Error",3e3,null,null,"")}},this.validateNewPassword=e=>{const a=e.newPassword,s=e.newPasswordAgain;let t={};return s&&a!==s&&(t.newPasswordAgain="Please check your new password"),t},this.state={newPassword:"",newPasswordAgain:""},this.formickRef=r.a.createRef()}componentDidMount(){document.title="Reset Password | Back Office"}componentDidUpdate(){this.props.error?E.a.warning(this.props.error,"Forgot Password Error",3e3,null,null,""):this.props.loading||"success"!==this.props.newPassword||(this.formickRef&&this.formickRef.resetForm(),E.a.success(this.props.resetPasswordMessage,"Reset Password Success",3e3,()=>this.props.history.push("/user/login"),null,""))}render(){const e=this.state,a={newPassword:e.newPassword,newPasswordAgain:e.newPasswordAgain};return r.a.createElement(n.a,{className:"h-100"},r.a.createElement(u.a,{xxs:"12",md:"7",className:"mx-auto my-auto"},r.a.createElement(o.a,{className:"auth-card"},r.a.createElement("div",{className:"position-relative image-side "},r.a.createElement("p",{className:"text-white h2"},"MAGIC IS IN THE DETAILS"),r.a.createElement("p",{className:"white mb-0"},"Please use your e-mail to reset your password. ",r.a.createElement("br",null),"If you are not a member, please"," ",r.a.createElement(d.b,{to:"/register",className:"white"},"register"),".")),r.a.createElement("div",{className:"form-side"},r.a.createElement(d.b,{to:"/",className:"white"},r.a.createElement("span",{className:"logo-single"})),r.a.createElement(c.a,{className:"mb-4"},r.a.createElement(h.a,{id:"user.reset-password"})),r.a.createElement(p.c,{ref:e=>this.formickRef=e,validate:this.validateNewPassword,initialValues:a,onSubmit:this.onResetPassword},({errors:e,touched:a})=>r.a.createElement(p.b,{className:"av-tooltip tooltip-label-bottom"},r.a.createElement(l.a,{className:"form-group has-float-label"},r.a.createElement(i.a,null,r.a.createElement(h.a,{id:"user.new-password"})),r.a.createElement(p.a,{className:"form-control",name:"newPassword",type:"password"})),r.a.createElement(l.a,{className:"form-group has-float-label"},r.a.createElement(i.a,null,r.a.createElement(h.a,{id:"user.new-password-again"})),r.a.createElement(p.a,{className:"form-control",name:"newPasswordAgain",type:"password"}),e.newPasswordAgain&&a.newPasswordAgain&&r.a.createElement("div",{className:"invalid-feedback d-block"},e.newPasswordAgain)),r.a.createElement("div",{className:"d-flex justify-content-end align-items-center"},r.a.createElement(m.a,{color:"primary",className:"btn-shadow btn-multiple-state ".concat(this.props.loading?"show-spinner":""),size:"lg"},r.a.createElement("span",{className:"spinner d-inline-block"},r.a.createElement("span",{className:"bounce1"}),r.a.createElement("span",{className:"bounce2"}),r.a.createElement("span",{className:"bounce3"})),r.a.createElement("span",{className:"label"},r.a.createElement(h.a,{id:"user.reset-password-button"}))))))))))}}a.default=Object(w.g)(Object(f.b)(({authUser:e})=>({newPassword:e.newPassword,resetPasswordCode:e.resetPasswordCode,resetPasswordMessage:e.resetPasswordMessage,loading:e.loading,error:e.error}),{resetPassword:P.F})(g))},92:function(e,a,s){"use strict";s.d(a,"a",(function(){return o})),s.d(a,"b",(function(){return c}));var t=s(1),r=s.n(t),n=s(334);const o=e=>r.a.createElement(n.a,Object.assign({},e,{widths:["xxs","xs","sm","md","lg","xl","xxl"]})),c=e=>r.a.createElement("div",{className:"separator ".concat(e.className)})},95:function(e,a,s){"use strict";var t=s(120),r=(s(114),s(115));s.d(a,"a",(function(){return r.a}));t.a},99:function(e,a,s){"use strict";var t=s(1),r=s.n(t),n=s(103);a.a=Object(n.d)(e=>r.a.createElement(n.a,e),{withRef:!1})}}]);
//# sourceMappingURL=user-reset-password.eccbf82b.chunk.js.map
var o=Object.defineProperty;var c=Object.getOwnPropertyDescriptor;var r=Object.getOwnPropertyNames;var b=Object.prototype.hasOwnProperty;var p=(a,t)=>{for(var s in t)o(a,s,{get:t[s],enumerable:!0})},m=(a,t,s,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let e of r(t))!b.call(a,e)&&e!==s&&o(a,e,{get:()=>t[e],enumerable:!(l=c(t,e))||l.enumerable});return a};var n=a=>m(o({},"__esModule",{value:!0}),a);var i={};p(i,{default:()=>h});module.exports=n(i);var h=[{match:/#.*/g,sub:"todo"},{match:/("""|''')(\\[^]|(?!\1)[^])*\1?/g,sub:"todo"},{type:"str",match:/f("|')(\\[^]|(?!\1).)*\1?|f((["'])\4\4)(\\[^]|(?!\3)[^])*\3?/gi,sub:[{type:"var",match:/{[^{}]*}/g,sub:[{match:/(?!^{)[^]*(?=}$)/g,sub:"py"}]}]},{expand:"str"},{type:"kwd",match:/\b(and|as|assert|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g},{type:"bool",match:/\b(False|True|None)\b/g},{expand:"num"},{type:"func",match:/[a-z_]+(?=\s*\()/g},{type:"oper",match:/[-/*+<>,=!&|^%]+/g},{type:"class",match:/\b[A-Z][\w_]*\b/g}];

var c=Object.defineProperty;var n=e=>c(e,"__esModule",{value:!0});var r=(e,t)=>{n(e);for(var a in t)c(e,a,{get:t[a],enumerable:!0})};r(exports,{default:()=>o});var s=[{match:/\/\*\*((?!\*\/)[^])*(\*\/)?/g,sub:"jsdoc"},{match:/\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,sub:"todo"},{expand:"str"},{match:/`((?!`)[^]|\\[^])*`?/g,sub:"js_template_literals"},{match:/=>|\b(this|set|get|as|async|await|break|case|catch|class|const|constructor|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|if|implements|import|in|instanceof|interface|let|var|of|new|package|private|protected|public|return|static|super|switch|throw|throws|try|typeof|void|while|with|yield)\b/g,type:"kwd"},{match:/\/((?!\/)[^\r\n\\]|\\.)+\/[dgimsuy]*/g,sub:"regex"},{expand:"num"},{match:/\b(NaN|null|undefined|[A-Z][A-Z_]*)\b/g,type:"num"},{match:/\b(true|false)\b/g,type:"bool"},{match:/[/*+:?&|%^~=!,<>.^-]+/g,type:"oper"},{match:/\b[A-Z]\w*\b/g,type:"class"},{match:/[a-zA-Z$][\w$]*(?=\s*((\?\.)?\s*\(|=\s*(\(?[\w,{}\[\])]+\)? =>|function\b)))/g,type:"func"}];var o=[{match:/:\s*(any|void|number|boolean|string|object|never|enum)\b/g,type:"type"},{match:/\b(type|namespace|typedef|interface|public|private|protected|implements|declare|abstract|readonly)\b/g,type:"kwd"},...s];0&&(module.exports={});

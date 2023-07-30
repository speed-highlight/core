import t from"./diff.js";var m=[{match:/^#.*/gm,sub:"todo"},{expand:"str"},...t,{type:"func",match:/^(\$ )?git(\s.*)?$/gm},{type:"kwd",match:/^commit \w+$/gm}];export{m as default};

const subRules = [
    { 
        type: 'func', 
        match: /\b(echo|date|pwd|ls|command|grep|sed|awk|diff|cat|sudo|cd|mkdir|rm|cp|mv|comm|sort|printf)\b/g 
    },
    { type: 'num', match: /\b\d+(\.\d+)?\b/g },
    { 
        type: 'kwd', 
        match: /\b(in|let|local|declare|export|do|done|then|fi|if|for|while|return|exit|case|esac)\b/g 
    },
    { type: 'oper', match: /[!@%*?#:-]|[\[\]]|[=+\-*/<>|&!^]+/g }, 
    { type: 'var', match: /[a-zA-Z_][a-zA-Z0-9_]*/g }
];

const variable = {
    type: 'var',
    match: /\$\w+|\$\{(?:[^}\\]|\\.)*\}|\$\((?:[^)(]|\([^)(]*\))*\)|\$\(\(.*\)\)/g,
    sub: subRules 
};

const doubleQuoteStr = { 
    type: 'str', 
    match: /"(\\[\s\S]|[^"\\])*"/g, 
    sub: [ variable ] 
};

const singleQuoteStr = { type: 'str', match: /'[^']*'/g };

subRules.push(doubleQuoteStr);
subRules.push(singleQuoteStr); 

export default [
    { type: 'kwd', match: /^#!.*/g },
    { type: 'cmnt', match: /(^|\s)#.*/g },
    
    { type: 'str', match: /<<\s*(['"])([a-zA-Z_][\w-]*)\1[\s\S]*?^\2$/gm },
    { type: 'str', match: /<<-?\s*([a-zA-Z_][\w-]*)[\s\S]*?^\1$/gm, sub: [ variable ] },

    singleQuoteStr,doubleQuoteStr,

    { type: 'oper', match: /<(?=\()/g },

    { type: 'var', match: /(?<=^|\s|[|&;])[a-zA-Z_][a-zA-Z0-9_]*(?==)/g },
    
    variable,

    {
        type: 'kwd',
        match: /\b(function|local|unset|readonly|shift|export|if|fi|else|elif|while|do|done|for|until|case|esac|break|continue|exit|return|trap|wait|eval|exec|then|declare|enable|select|typeset|time|EOF|EXPECTED|let|in)\b/g
    },
    
    { type: 'kwd', match: /(?<=^|\s|\[)--?[a-zA-Z0-9-]+(?=\s|$|\])/g },
    { type: 'bool', match: /(?<=^|\s)(true|false)(?=\s|$)/g },

    {
        type: 'oper',
        match: /\(\([\s\S]*?\)\)|\[\[[\s\S]*?\]\]|[=(){}<>!|&]+/g,
        sub: [...subRules, variable] 
    },
    
    { type: 'func', match: /(?<=function\s+)[a-z_][a-z0-9_.-]*/gmi },
    { type: 'func', match: /(?<=^|\s)[a-z_][a-z0-9_.-]*(?=\s*\(\))/gmi },

    {
        type: 'func',
        match: /(?<=^|\||&&|;|do\s+|then\s+)\b(?!(?:if|fi|else|elif|while|do|done|for|until|case|esac|break|continue|exit|return|then|local|declare|in|let)\b)[a-z_][a-z0-9_.-]*\b/gm
    },

    { type: 'num', match: /\b\d+\b/g }
];
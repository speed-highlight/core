export default [
  {
    match: /^(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH|PRI|SEARCH)\b/gm,
    type: 'kwd',
  },
  {
    match: /\bHTTP\/[\d.]+\b/g,
    type: 'kwd',
  },
  {
    expand: 'str',
  },
  {
    expand: 'num',
  },
  {
    match: /[,;:=]/g,
    type: 'oper',
  },
  {
    match: /[a-zA-Z][\w-]*(?=:)/g,
    type: 'var',
  },
];
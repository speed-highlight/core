export default [
	{
		match: /;;.*|\(;((?!;\))[^])*(;\))?/g,
		sub: 'todo'
	},
	{
		expand: 'strDouble'
	},
	{
		type: 'var',
		match: /\$[^\s()";]*/g
	},
	{
		type: 'func',
		match: /\b[a-z]\w*\.[\w.]+/g
	},
	{
		type: 'kwd',
		match: /\b(align|block|br|br_if|br_table|call|call_indirect|catch|data|declare|drop|elem|else|end|export|func|global|if|import|item|local|loop|memory|module|mut|nop|offset|param|result|return|select|start|table|tag|then|throw|try|type|unreachable)\b/g
	},
	{
		type: 'type',
		match: /\b(anyref|externref|f32|f64|funcref|i8|i16|i32|i64|v128)\b/g
	},
	{
		expand: 'num'
	},
	{
		type: 'oper',
		match: /[=+-]+/g
	}
]

export default [
	{
		match: /^#.*/gm,
		sub: 'todo'
	},
	{
		match: /^\w+(?=:?)/gm,
		type: 'class'
	},
	{
		match: /:\d+/g,
		type: 'num'
	},
	{
		match: /[:/&?]|\w+=/g,
		type: 'oper'
	},
	{
		match: /[.\w]+@|#[\w]+$/gm,
		type: 'func'
	},
	{
		match: /\w+\.\w+(\.\w+)*/g,
		type: 'var'
	}
]
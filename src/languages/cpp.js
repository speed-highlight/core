export default [
	{
		match: /\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,
		sub: 'todo'
	},
	{
		type: 'str',
		match: /R"([^(]{0,16})\([^]*?(\)\1"|$)/g
	},
	{
		expand: 'str'
	},
	{
		expand: 'num'
	},
	{
		type: 'kwd',
		match: /#\s*include (<.*>|".*")/g,
		sub: [
			{
				type: 'str',
				match: /(<|").*/g
			}
		]
	},
	{
		type: 'kwd',
		match: /\*|&|#[a-z]+\b|\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char8_t|char16_t|char32_t|class|concept|const|consteval|constexpr|constinit|const_cast|continue|co_await|co_return|co_yield|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/g
	},
	{
		type: 'bool',
		match: /\b(true|false|nullptr)\b/g
	},
	{
		type: 'oper',
		match: /[/*+:?&|%^~=!,<>.^-]+/g
	},
	{
		type: 'func',
		match: /[a-zA-Z_][\w_]*(?=\s*\()/g
	},
	{
		type: 'class',
		match: /\b[A-Z][\w_]*\b/g
	}
]

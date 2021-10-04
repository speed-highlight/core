#!/bin/lua

--[=[
	This is also a block comment
	We can include "]]" inside this comment
--]=]

--[==[
	This is also a block comment
	We can include "]=]" inside this comment
f --]==]

vf --tst

a = 'alo\n123"'
a = "alo\n123\""
a = '\97lo\10\04923"'
a = [[alo
123"]]
a = [==[
alo
123"]==]

var ::= prefixexp `[´ exp `]´

stat ::= while exp do block end
stat ::= repeat block until exp
stat ::= if exp then block {elseif exp then block} [else block] end

do
	local f, s, var = explist
	while true do
		local var_1, ···, var_n = f(s, var)
		var = var_1
		if var == nil then break end
		block
	end
end

do
	local t = {}
	t[f(1)] = g
	t[1] = "x"         -- 1st exp
	t[2] = "y"         -- 2nd exp
	t.x = 1            -- t["x"] = 1
	t[3] = f(x)        -- 3rd exp
	t[30] = 23
	t[4] = 45          -- 4th exp
	a = t
end

function max(num1, num2)

	if (num1 > num2) then
		 result = num1;
	else
		 result = num2;
	end

	return result;
end
--]=]
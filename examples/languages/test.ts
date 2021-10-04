type Result = "pass" | "fail"

interface User {
	id: number
	firstName: string
	lastName: string
	role: string
	result: Result
}

const test = {
	test: value
};

function updateUser(id: number, update: Partial<User>) {
const user = getUser(id)
const newUser = { ...user, ...update }
saveUser(id, newUser)
}

function compact(arr: string[]) {
	if (arr.length > 10)
		return arr.slice(0, 10)
	return arr
}

namespace Validation {
	export interface StringValidator {
		isAcceptable(s: string): boolean;
	}
	const lettersRegexp = /^[A-Za-z]+$/;
	const numberRegexp = /^[0-9]+$/;
	export class LettersOnlyValidator implements StringValidator {
		isAcceptable(s: string) {
			return lettersRegexp.test(s);
		}
	}
	export class ZipCodeValidator implements StringValidator {
		isAcceptable(s: string) {
			return s.length === 5 && numberRegexp.test(s);
		}
	}
}
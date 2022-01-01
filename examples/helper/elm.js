export const elm = (type, opt, parent) => {
	let elm = document.createElement(type)
	if (typeof opt === 'object')
		Object.assign(elm, opt)
	else
		parent = opt;
	(parent ?? document.body)?.appendChild?.(elm)
	return elm
}

export class Checkbox
{
	constructor(name, content, callback, parent, type = 'checkbox')
	{
		this.input = elm('input', {
			name: name,
			type: type,
			id: content
		}, parent)
		elm('label', {
			htmlFor: content,
			textContent: content
		}, parent)
		this.content = content
		this.callback = e => callback(this.on)
		this.input.addEventListener('change', this.callback)
	}
	set on(bool) {
		this.input.checked = bool
		this.callback()
	}
	get on() {
		return this.input.checked
	}
	get id() {
		return this.content
	}
}

export class Radio {
	constructor(name, callback, options, parent) {
		let container = elm('div', { className: 'radio-list' }, parent);
		this.list = [];
		for (let option of options)
			this.list.push(new Checkbox(name, option, e => callback(this.selected), container, 'radio'))
		this.selected = 0;
	}
	set selected(id) {
		if (this.list[id])
			this.list[id].on = true
	}
	get selected() {
		for (let checkbox of this.list)
			if (checkbox.on)
				return checkbox.id;
		return null;
	}
}

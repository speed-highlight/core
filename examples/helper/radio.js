export default class Radio {
	constructor(name, options, parent) {
		this.listElm = document.createElement('div');
		this.listElm.className = 'radio-list';
		this.list = [];
		for (let option of options)
		{
			let label = document.createElement('label'),
				input = document.createElement('input');
			input.type = 'radio';
			input.name = name;
			input.id = label.htmlFor = label.textContent = option;
			input.addEventListener('change', e => this.callback?.())
			this.listElm.appendChild(input);
			this.listElm.appendChild(label);
			this.list.push([option, input]);
		}
		parent.appendChild(this.listElm);
	}
	set selected(id) {
		if (this.list[id])
		{
			this.list[id][1].checked = true;
			this.callback?.();
		}
	}
	get selected() {
		for (let [name, input] of this.list)
			if (input.checked)
				return name;
		return null;
	}
	onchange(callback) {
		this.callback = _ => callback(this.selected);
	}
}
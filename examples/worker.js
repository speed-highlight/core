import { highlightText } from '../src/index.js'

onmessage = async e => {
	const result = await highlightText(e.data[0], e.data[1] || 'js');
	postMessage(result);
};

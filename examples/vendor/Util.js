if (!String.prototype.trim) {
	String.prototype.trim = ()=> this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

function getOffset(el) {
	let offset = {
		top: el.offsetTop,
		left: el.offsetLeft
	};
	while (el.offsetParent) {
		el = el.offsetParent;
		offset.top += el.offsetTop;
		offset.left += el.offsetLeft;
	}
	return offset;
};

function stringRepeat(string, count) {
	var result = '';
	while (count > 0) {
		if (count & 1) {
			result += string;
		}
		if (count >>= 1) {
			string += string;
		}
	}
	return result;
}

function _setStyles(style) {
	style.width = 'auto';
	style.left = '0px';
	style.visibility = 'hidden';
	style.position = 'absolute';
	style.whiteSpace = 'pre';
	style.font = 'inherit';
	style.overflow = 'visible';
}

function computerCharCount() {
	let result;
	let el = document.createElement('div');
	_setStyles(el.style);
	el.style.width = '0.2px';
	document.documentElement.appendChild(el);
	var width = el.getBoundingClientRect().width;
	if (width > 0 && width < 1) {
		result = 50;
	} else {
		result = 100;
	}
	el.parentNode.removeChild(el);
	return result;
}

function isExclude(text) {
	return text.substring(0, 3) == '@@|';
}

function formatExclude(text) {
	const array = text.split('|');
	return [{
		type: 'exclude-sign',
		value: array[0] ? array[0] : ''
	}, {
		type: 'separator',
		value: '|'
	}, {
		type: 'url',
		value: array[1] ? array[1] : ''
	}, {
		type: 'separator',
		value: '|'
	}, {
		type: 'element',
		value: array[2] ? array[2] : ''
	}];
}

function getBracketsIndex(rule) {

	let result = {
		start: 0,
		end: 0
	};

	if (rule.indexOf('[') != -1) {
		result.start = rule.indexOf('[') + 1;
		let flag = 1;
		for (let i = result.start, len = rule.length; i < len; i++) {
			if (rule.charAt(i) == '[') {
				flag++;
			} else if (rule.charAt(i) == ']') {
				flag--;
			}
			if (flag == 0) {
				result.end = i;
				break;
			}
		}
	}

	return result;

}

function formatRule(text) {

	let result = [];

	if (text.indexOf('##') == -1) {
		return [{
			type: 'text',
			value: text
		}];
	}

	const array = text.split('##');

	result = result.concat({
		type: 'url',
		value: array[0] ? array[0] : ''
	}, {
		type: 'separator',
		value: '##'
	});

	let rule = array[1];
	if (rule && rule.indexOf('[') != -1) {

		result.push({
			type: 'element',
			value: rule.substring(0, rule.indexOf('['))
		});

		rule = rule.substring(rule.indexOf('['));
		while (rule && rule.indexOf(']') != -1) {
			let bracketsIndex = getBracketsIndex(rule);
			let sub = rule.substring(bracketsIndex.start, bracketsIndex.end);
			if (sub) {
				if (sub.indexOf('=') != -1) {
					const prop = sub.substring(0, sub.indexOf('='));
					const value = sub.substring(sub.indexOf('=') + 1);
					result = result.concat({
						type: 'bracket',
						value: '['
					}, {
						type: 'prop',
						value: prop ? prop : ''
					}, {
						type: 'equal',
						value: '='
					}, {
						type: 'value',
						value: value ? value : ''
					}, {
						type: 'bracket',
						value: ']'
					});
				} else {
					result = result.concat({
						type: 'bracket',
						value: '['
					}, {
						type: 'value',
						value: sub
					}, {
						type: 'bracket',
						value: ']'
					});
				}
			}
			rule = rule.substring(rule.indexOf(']') + 1);
		}

	}

	if (rule) {
		result.push({
			type: 'element',
			value: rule
		});
	}

	return result;

}

export default {
	getOffset,
	stringRepeat,
	computerCharCount,
	isExclude,
	formatExclude,
	formatRule
};
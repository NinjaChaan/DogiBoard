module.exports = {
	"env": {
		"commonjs": true,
		"es6": true,
		"node": true
	},
	"extends": "airbnb",
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 2018
	},
	"rules": {
		"indent": [2, "tab", { "SwitchCase": 1, "VariableDeclarator": 1 }],
		"no-tabs": 0,
		"react/prop-types": 0,
		"react/jsx-indent": [2, "tab"],
		"react/jsx-indent-props": [2, "tab"],
		"linebreak-style": [
			"error",
			"unix"
		],
		"no-param-reassign": 0,
		"no-underscore-dangle": 0,
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"never"
		],
		'eqeqeq': 'error',
		'arrow-spacing': [
			'error', { 'before': true, 'after': true }
		],
		'no-console': 0,
		'comma-dangle': 0,
		'no-undef': 0,
		'prefer-destructuring': 0,
		'react/jsx-filename-extension': 0,
		'jsx-a11y/no-static-element-interactions': 0,
		'jsx-a11y/click-events-have-key-events': 0,
		'jsx-a11y/no-noninteractive-tabindex': 0,
		'jsx-a11y/no-autofocus': 0,
		'react/jsx-props-no-spreading': 0,
		'no-case-declarations': 0,
		'react/jsx-boolean-value': 0
	}
}
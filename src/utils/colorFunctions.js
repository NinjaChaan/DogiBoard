/* eslint-disable prefer-const */
const rgb2hsl = (color) => {
	const r = color[0] / 255
	const g = color[1] / 255
	const b = color[2] / 255

	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h = 0
	let s = 0
	const l = (max + min) / 2

	if (max === min) {
		h = 0
		s = 0 // achromatic
	} else {
		const d = max - min
		s = (l > 0.5 ? d / (2 - max - min) : d / (max + min))
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break
			case g: h = (b - r) / d + 2; break
			case b: h = (r - g) / d + 4; break
			default: break
		}
		h /= 6
	}

	return [h, s, l]
}

const hsl2rgb = (color) => {
	let l = color[2]

	if (color[1] === 0) {
		l = Math.round(l * 255)
		return [l, l, l]
	}
	function hue2rgb(p, q, t) {
		if (t < 0) t += 1
		if (t > 1) t -= 1
		if (t < 1 / 6) return p + (q - p) * 6 * t
		if (t < 1 / 2) return q
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
		return p
	}

	const s = color[1]
	const q = (l < 0.5 ? l * (1 + s) : l + s - l * s)
	const p = 2 * l - q
	const r = hue2rgb(p, q, color[0] + 1 / 3)
	const g = hue2rgb(p, q, color[0])
	const b = hue2rgb(p, q, color[0] - 1 / 3)
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

const _interpolateHSL = (color1, color2, factor) => {
	const hsl1 = rgb2hsl(color1)
	const hsl2 = rgb2hsl(color2)
	for (let i = 0; i < 3; i += 1) {
		hsl1[i] += factor * (hsl2[i] - hsl1[i])
	}
	return hsl2rgb(hsl1)
}

function perc2color(perc) {
	let r; let g; let b = 0
	// if (perc < 50) {
	// 	r = 255
	// 	g = Math.round(5.1 * perc)
	// } else {
	// 	g = 255
	// 	r = Math.round(510 - 5.10 * perc)
	// }
	// r = Math.round(255 - 2.55 * perc)
	// g = Math.round(2.55 * perc)
	const res = _interpolateHSL([255, 0, 0], [0, 255, 0], perc / 100)

	// Scale down
	let col2 = rgb2hsl(res)
	col2[2] *= 0.75
	const res2 = hsl2rgb(col2)

	r = res[0]
	g = res[1]
	b = res[2]

	const r2 = res2[0]
	const g2 = res2[1]
	const b2 = res2[2]
	const h = r * 0x10000 + g * 0x100 + b * 0x1
	const h2 = r2 * 0x10000 + g2 * 0x100 + b2 * 0x1
	return {
		bg: `#${(`000000${h.toString(16)}`).slice(-6)}`,
		border: `#${(`000000${h2.toString(16)}`).slice(-6)}`
	}
}

export default perc2color

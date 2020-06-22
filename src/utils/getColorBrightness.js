
const getBrightness = (rgb) => (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 125

export default getBrightness

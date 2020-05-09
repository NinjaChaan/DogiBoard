/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
import styled, { css } from 'styled-components'
import { device } from '../devices'

// eslint-disable-next-line import/prefer-default-export
const Button = styled.button`
	display: flex;
	justify-content: center;
	vertical-align: middle;
	padding: .375rem .75rem;
	height: 35px;
	width: 100%;
	margin-bottom: 10px;
	border: transparent;
	border-radius: 4px;
	outline:none;
	font-weight: 600;
	

	background-color: ${(props) =>
		(props.primary && props.theme.colors.primary.backgroundColor)
		|| (props.warning && props.theme.colors.warning.backgroundColor)
		|| (props.warning_light && props.theme.colors.warning_light.backgroundColor)
		|| (props.light && props.theme.colors.light.backgroundColor)
		|| (props.link && props.theme.colors.link.backgroundColor)
		|| props.theme.colors.primary.backgroundColor
	};
	color: ${(props) =>
		(props.primary && props.theme.colors.primary.color)
		|| (props.warning && props.theme.colors.warning.color)
		|| (props.warning_light && props.theme.colors.warning_light.color)
		|| (props.light && props.theme.colors.light.color)
		|| (props.link && props.theme.colors.link.color)
		|| props.theme.colors.primary.color
	};

	@media ${device.tabletMAX} {
		background-color: ${(props) =>
		(props.warning_light && props.theme.colors.warning.backgroundColor)
	};
		color: ${(props) =>
		(props.warning_light && props.theme.colors.warning.color)
	};
	}
	
	&:hover {
	background-color: ${(props) =>
		(props.primary && props.theme.colors.primary.hover.backgroundColor)
		|| (props.warning && props.theme.colors.warning.hover.backgroundColor)
		|| (props.warning_light && props.theme.colors.warning_light.hover.backgroundColor)
		|| (props.light && props.theme.colors.light.hover.backgroundColor)
		|| (props.link && props.theme.colors.link.hover.backgroundColor)
		|| (props.theme.colors.primary.hover.backgroundColor)
	};

	color: ${(props) =>
		(props.primary && props.theme.colors.primary.hover.color)
		|| (props.warning && props.theme.colors.warning.hover.color)
		|| (props.warning_light && props.theme.colors.warning_light.hover.color)
		|| (props.light && props.theme.colors.light.hover.color)
		|| (props.link && props.theme.colors.link.hover.color)
		|| (props.theme.colors.primary.hover.color)
	};
		outline: none;
	}
	&:focus {
	border: transparent;
	outline: none;
}
	&:active {
	border: transparent;
	outline: none;
	background-color: ${(props) =>
		(props.primary && props.theme.colors.primary.focus.backgroundColor)
		|| (props.warning && props.theme.colors.warning.focus.backgroundColor)
		|| (props.warning_light && props.theme.colors.warning_light.focus.backgroundColor)
		|| (props.light && props.theme.colors.light.focus.backgroundColor)
		|| (props.link && props.theme.colors.link.focus.backgroundColor)
		|| (props.theme.colors.primary.focus.backgroundColor)
	};

	color: ${(props) =>
		(props.primary && props.theme.colors.primary.focus.color)
		|| (props.warning && props.theme.colors.warning.focus.color)
		|| (props.warning_light && props.theme.colors.warning_light.focus.color)
		|| (props.light && props.theme.colors.light.focus.color)
		|| (props.link && props.theme.colors.link.focus.color)
		|| (props.theme.colors.primary.focus.color)
	};
}
	&:visited {
	border: transparent;
	outline: none;
}
`

export default Button

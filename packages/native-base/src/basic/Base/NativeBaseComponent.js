import PropTypes from "prop-types";
import { Component } from "react";

export default class NativeBaseComponent extends Component {
	static propTypes = {
		// eslint-disable-next-line react/forbid-prop-types
		theme: PropTypes.object,
	};

	static contextTypes = {
		theme: PropTypes.object,
		foregroundColor: PropTypes.string,
	};

	static childContextTypes = {
		theme: PropTypes.object,
		foregroundColor: PropTypes.string,
	};

	getChildContext() {
		return {
			theme: this.props.theme ? this.props.theme : this.context.theme,
		};
	}

	getContextForegroundColor() {
		return this.context.foregroundColor;
	}
}

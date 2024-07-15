import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { View } from "react-native";

import variables from "../theme/variables/platform";
import computeProps from "../utils/computeProps";
import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class InputGroup extends Component {
	getInitialStyle() {
		return {
			roundedInputGroup: {
				borderWidth: this.props.rounded ? 1 : undefined,
				borderRadius: this.props.rounded
					? variables.inputGroupRoundedBorderRadius
					: undefined,
			},
		};
	}

	prepareRootProps() {
		const defaultProps = {
			style: this.getInitialStyle().roundedInputGroup,
		};

		return computeProps(this.props, defaultProps);
	}
	render() {
		return (
			<View ref={(c) => (this._root = c)} {...this.prepareRootProps()}>
				{this.props.children}
			</View>
		);
	}
}

InputGroup.propTypes = {
	regular: PropTypes.bool,
	underline: PropTypes.bool,
	rounded: PropTypes.bool,
	success: PropTypes.bool,
	error: PropTypes.bool,
	disabled: PropTypes.bool,
};

const StyledInputGroup = connectStyle(
	"NativeBase.InputGroup",
	{},
	mapPropsToStyleNames,
)(InputGroup);

export { StyledInputGroup as InputGroup };

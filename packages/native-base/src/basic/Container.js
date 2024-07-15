import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { View } from "react-native";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Container extends Component {
	render() {
		return (
			<View ref={(c) => (this._root = c)} {...this.props}>
				{this.props.children}
			</View>
		);
	}
}

Container.propTypes = {
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
};

const StyledContainer = connectStyle(
	"NativeBase.Container",
	{},
	mapPropsToStyleNames,
)(Container);

export { StyledContainer as Container };

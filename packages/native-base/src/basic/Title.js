import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Text } from "react-native";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Title extends Component {
	render() {
		return (
			<Text ref={(c) => (this._root = c)} numberOfLines={1} {...this.props} />
		);
	}
}

Title.propTypes = {
	...Text.propTypes,
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
};

const StyledTitle = connectStyle(
	"NativeBase.Title",
	{},
	mapPropsToStyleNames,
)(Title);
export { StyledTitle as Title };

import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Text } from "react-native";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Label extends Component {
	render() {
		return <Text ref={(c) => (this._root = c)} {...this.props} />;
	}
}

Label.propTypes = {
	...Text.propTypes,
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
	floatBack: PropTypes.number,
};

const StyledLabel = connectStyle(
	"NativeBase.Label",
	{},
	mapPropsToStyleNames,
)(Label);

export { StyledLabel as Label };

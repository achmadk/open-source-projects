import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { View } from "react-native";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Body extends Component {
	render() {
		return <View ref={(c) => (this._root = c)} {...this.props} />;
	}
}

Body.propTypes = {
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
};

const StyledBody = connectStyle(
	"NativeBase.Body",
	{},
	mapPropsToStyleNames,
)(Body);

export { StyledBody as Body };

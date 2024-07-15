import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { View } from "react-native";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Toast extends Component {
	render() {
		return <View ref={(c) => (this._root = c)} {...this.props} />;
	}
}

Toast.propTypes = {
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
};

const StyledToast = connectStyle(
	"NativeBase.Toast",
	{},
	mapPropsToStyleNames,
)(Toast);
export { StyledToast as Toast };

import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { View } from "react-native";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class TabHeadingNB extends Component {
	render() {
		return <View ref={(c) => (this._root = c)} {...this.props} />;
	}
}

TabHeadingNB.propTypes = {
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
};

const StyledTabHeadingNB = connectStyle(
	"NativeBase.TabHeading",
	{},
	mapPropsToStyleNames,
)(TabHeadingNB);
export { StyledTabHeadingNB as TabHeading };

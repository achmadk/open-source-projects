import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { View } from "react-native";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Segment extends Component {
	render() {
		return <View ref={(c) => (this._root = c)} {...this.props} />;
	}
}

Segment.propTypes = {
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
};

const StyledSegment = connectStyle(
	"NativeBase.Segment",
	{},
	mapPropsToStyleNames,
)(Segment);
export { StyledSegment as Segment };

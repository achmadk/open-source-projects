import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Image } from "react-native";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Thumbnail extends Component {
	render() {
		return <Image ref={(c) => (this._root = c)} {...this.props} />;
	}
}

Thumbnail.propTypes = {
	...Image.propTypes,
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
	square: PropTypes.bool,
	circular: PropTypes.bool,
	size: PropTypes.number,
};

const StyledThumbnail = connectStyle(
	"NativeBase.Thumbnail",
	{},
	mapPropsToStyleNames,
)(Thumbnail);

export { StyledThumbnail as Thumbnail };

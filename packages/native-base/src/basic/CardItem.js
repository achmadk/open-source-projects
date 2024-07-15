import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class CardItem extends Component {
	render() {
		if (this.props.button) {
			return (
				<TouchableOpacity
					ref={(c) => (this._root = c)}
					activeOpacity={0.2}
					{...this.props}
				>
					{this.props.children}
				</TouchableOpacity>
			);
		}
		return (
			<View ref={(c) => (this._root = c)} {...this.props}>
				{this.props.children}
			</View>
		);
	}
}

CardItem.propTypes = {
	...TouchableOpacity.propTypes,
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
	header: PropTypes.bool,
	cardBody: PropTypes.bool,
	footer: PropTypes.bool,
	button: PropTypes.bool,
};

const StyledCardItem = connectStyle(
	"NativeBase.CardItem",
	{},
	mapPropsToStyleNames,
)(CardItem);

export { StyledCardItem as CardItem };

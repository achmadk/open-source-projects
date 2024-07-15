import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {
	Platform,
	TouchableHighlight,
	TouchableNativeFeedback,
	View,
} from "react-native";

import variable from "../theme/variables/platform";
import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class ListItem extends Component {
	static contextTypes = {
		theme: PropTypes.object,
	};
	render() {
		const variables = this.context.theme
			? this.context.theme["@@shoutem.theme/themeStyle"].variables
			: variable;

		if (
			Platform.OS === "ios" ||
			Platform.OS === "web" ||
			variables.androidRipple === false ||
			(!this.props.onPress && !this.props.onLongPress) ||
			Platform.Version <= 21
		) {
			return (
				<TouchableHighlight
					onPress={this.props.onPress}
					onLongPress={this.props.onLongPress}
					ref={(c) => (this._root = c)}
					underlayColor={variables.listBtnUnderlayColor}
					{...this.props}
					style={this.props.touchableHighlightStyle}
				>
					<View {...this.props} testID={undefined}>
						{this.props.children}
					</View>
				</TouchableHighlight>
			);
		}
		return (
			<TouchableNativeFeedback
				ref={(c) => (this._root = c)}
				useForeground
				{...this.props}
			>
				<View style={{ marginLeft: -17, paddingLeft: 17 }}>
					<View {...this.props} testID={undefined}>
						{this.props.children}
					</View>
				</View>
			</TouchableNativeFeedback>
		);
	}
}

ListItem.propTypes = {
	...TouchableHighlight.propTypes,
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
	touchableHighlightStyle: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
	]),
	itemDivider: PropTypes.bool,
	button: PropTypes.bool,
};

const StyledListItem = connectStyle(
	"NativeBase.ListItem",
	{},
	mapPropsToStyleNames,
)(ListItem);

export { StyledListItem as ListItem };

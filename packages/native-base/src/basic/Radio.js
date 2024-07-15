import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Platform, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import variable from "../theme/variables/platform";
import computeProps from "../utils/computeProps";
import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Radio extends Component {
	static contextTypes = {
		theme: PropTypes.object,
	};
	prepareRootProps() {
		const defaultProps = {
			standardStyle: false,
		};

		return computeProps(this.props, defaultProps);
	}

	render() {
		const variables = this.context.theme
			? this.context.theme["@@shoutem.theme/themeStyle"].variables
			: variable;

		return (
			<TouchableOpacity
				ref={(c) => (this._root = c)}
				{...this.prepareRootProps()}
			>
				{Platform.OS === "ios" && !this.props.standardStyle ? (
					this.props.selected && (
						<Icon
							style={{
								color: this.props.selectedColor
									? this.props.selectedColor
									: variables.radioColor,
								lineHeight: 25,
								height: 20,
								fontSize: variables.radioBtnSize,
							}}
							name="ios-checkmark"
						/>
					)
				) : (
					<Icon
						style={{
							color:
								Platform.OS === "ios"
									? this.props.selected
										? this.props.selectedColor
											? this.props.selectedColor
											: variables.radioColor
										: this.props.color
											? this.props.color
											: undefined
									: this.props.selected
										? this.props.selectedColor
											? this.props.selectedColor
											: variables.radioSelectedColorAndroid
										: this.props.color
											? this.props.color
											: undefined,
							lineHeight: variables.radioBtnLineHeight,
							fontSize: variables.radioBtnSize,
						}}
						name={
							Platform.OS === "ios"
								? this.props.selected
									? "ios-radio-button-on"
									: "ios-radio-button-off"
								: this.props.selected
									? "md-radio-button-on"
									: "md-radio-button-off"
						}
					/>
				)}
			</TouchableOpacity>
		);
	}
}

Radio.propTypes = {
	...TouchableOpacity.propTypes,
	selected: PropTypes.bool,
	standardStyle: PropTypes.bool,
};

const StyledRadio = connectStyle(
	"NativeBase.Radio",
	{},
	mapPropsToStyleNames,
)(Radio);

export { StyledRadio as Radio };

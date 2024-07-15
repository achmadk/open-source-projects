import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { View } from "react-native";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

import { ActionSheetContainer as ActionSheet } from "./Actionsheet";
import { ToastContainer as Toast } from "./ToastContainer";

class Root extends Component {
	render() {
		return (
			<View ref={(c) => (this._root = c)} {...this.props} style={{ flex: 1 }}>
				{this.props.children}
				<Toast
					ref={(c) => {
						if (c) Toast.toastInstance = c;
					}}
				/>
				<ActionSheet
					ref={(c) => {
						if (c) ActionSheet.actionsheetInstance = c;
					}}
				/>
			</View>
		);
	}
}

Root.propTypes = {
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
};

const StyledRoot = connectStyle(
	"NativeBase.Root",
	{},
	mapPropsToStyleNames,
)(Root);

export { StyledRoot as Root };

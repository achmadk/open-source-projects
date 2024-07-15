/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";

import variable from "../theme/variables/platform";
import getStyle from "../utils/getStyle";
import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Header extends Component {
	static contextTypes = {
		theme: PropTypes.object,
	};

	render() {
		const {
			androidStatusBarColor,
			iosBarStyle,
			style,
			transparent,
			translucent,
		} = this.props;

		const variables = this.context.theme
			? this.context.theme["@@shoutem.theme/themeStyle"].variables
			: variable;

		const platformStyle = variables.platformStyle;

		return (
			<View>
				<StatusBar
					backgroundColor={
						androidStatusBarColor
							? androidStatusBarColor
							: variables.statusBarColor
					}
					barStyle={
						iosBarStyle
							? iosBarStyle
							: platformStyle === "material"
								? "light-content"
								: variables.iosStatusbar
					}
					translucent={transparent ? true : translucent}
				/>
				<SafeAreaView
					style={{
						backgroundColor: getStyle(style).backgroundColor,
					}}
				>
					<View ref={(c) => (this._root = c)} {...this.props} />
				</SafeAreaView>
			</View>
		);
	}
}

Header.propTypes = {
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
	searchBar: PropTypes.bool,
	rounded: PropTypes.bool,
};

const StyledHeader = connectStyle(
	"NativeBase.Header",
	{},
	mapPropsToStyleNames,
)(Header);
export { StyledHeader as Header };

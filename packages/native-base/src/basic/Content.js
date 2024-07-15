import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import { KeyboardAwareScrollView } from "@codler/react-native-keyboard-aware-scroll-view";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { SafeAreaView } from "react-native";

import variable from "../theme/variables/platform";
import getStyle from "../utils/getStyle";
import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Content extends PureComponent {
	static contextTypes = {
		theme: PropTypes.object,
	};

	render() {
		const {
			children,
			contentContainerStyle,
			disableKBDismissScroll,
			keyboardShouldPersistTaps,
			padder,
			style,
		} = this.props;

		const containerStyle = {
			flex: 1,
			backgroundColor: getStyle(style).backgroundColor,
		};

		const variables = this.context.theme
			? this.context.theme["@@shoutem.theme/themeStyle"].variables
			: variable;

		return (
			<SafeAreaView style={containerStyle}>
				<KeyboardAwareScrollView
					automaticallyAdjustContentInsets={false}
					resetScrollToCoords={disableKBDismissScroll ? null : { x: 0, y: 0 }}
					keyboardShouldPersistTaps={keyboardShouldPersistTaps || "handled"}
					ref={(c) => {
						this._scrollview = c;
						this._root = c;
					}}
					{...this.props}
					contentContainerStyle={[
						{ padding: padder ? variables.contentPadding : undefined },
						contentContainerStyle,
					]}
				>
					{children}
				</KeyboardAwareScrollView>
			</SafeAreaView>
		);
	}
}

Content.propTypes = {
	disableKBDismissScroll: PropTypes.bool,
	keyboardShouldPersistTaps: PropTypes.string,
	padder: PropTypes.bool,
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
};

const StyledContent = connectStyle(
	"NativeBase.Content",
	{},
	mapPropsToStyleNames,
)(Content);

export { StyledContent as Content };

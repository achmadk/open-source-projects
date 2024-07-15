import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import { Picker } from "@react-native-picker/picker";
import createReactClass from "create-react-class";
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prefer-es6-class */
import React, { Component } from "react";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

export default class PickerNB extends Component {
	render() {
		return (
			<Picker ref={(c) => (this._root = c)} {...this.props}>
				{this.props.children}
			</Picker>
		);
	}
}

// eslint-disable-next-line react/no-multi-comp
PickerNB.Item = createReactClass({
	render() {
		return <Picker.Item {...this.props} />;
	},
});

PickerNB.propTypes = {
	...Picker.propTypes,
};

const StyledPickerNB = connectStyle(
	"NativeBase.PickerNB",
	{},
	mapPropsToStyleNames,
)(PickerNB);

export { StyledPickerNB as PickerNB };

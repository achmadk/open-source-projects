import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import { Picker } from "@react-native-picker/picker";
import React, { Component } from "react";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Item extends Component {
	render() {
		return <Picker.Item ref={(c) => (this._root = c)} {...this.props} />;
	}
}

Item.propTypes = {
	...Picker.Item.propTypes,
};

const StyledItem = connectStyle(
	"NativeBase.Item",
	{},
	mapPropsToStyleNames,
)(Item);

export { StyledItem as Item };

import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { FlatList, View } from "react-native";

import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

class Card extends Component {
	render() {
		if (this.props.dataArray && this.props.renderRow) {
			return (
				<FlatList
					{...this.props}
					data={this.props.dataArray}
					renderItem={this.props.renderRow}
					keyExtractor={(item, index) => index.toString()}
				/>
			);
		}
		return (
			<View ref={(c) => (this._root = c)} {...this.props}>
				{this.props.children}
			</View>
		);
	}
}

Card.propTypes = {
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
	// eslint-disable-next-line react/forbid-prop-types
	dataArray: PropTypes.array,
	renderRow: PropTypes.func,
};

const StyledCard = connectStyle(
	"NativeBase.Card",
	{},
	mapPropsToStyleNames,
)(Card);

export { StyledCard as Card };

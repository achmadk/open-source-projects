import { connectStyle } from "@achmadk/legacy-native-base-shoutem-theme";
import md5 from "blueimp-md5";
import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { Image } from "react-native";

import computeProps from "../utils/computeProps";
import mapPropsToStyleNames from "../utils/mapPropsToStyleNames";

import NativeBaseComponent from "./Base/NativeBaseComponent";

const GRAVATAR_URI = "https://www.gravatar.com/avatar/";

class Gravatar extends NativeBaseComponent {
	getInitialStyle() {
		return {
			gravatar: {
				borderRadius: this.props.size ? this.props.size / 2 : 15,
				width: this.props.size ? this.props.size : 30,
				height: this.props.size ? this.props.size : 30,
				resizeMode: this.props.contain ? "contain" : undefined,
			},
		};
	}

	prepareRootProps() {
		const gravatarStyle = {};
		if (this.props.circular) {
			gravatarStyle.width = this.props.size;
			gravatarStyle.height = this.props.size;
			gravatarStyle.borderRadius = this.props.size / 2;
		} else if (this.props.square) {
			gravatarStyle.width = this.props.size;
			gravatarStyle.height = this.props.size;
			gravatarStyle.borderRadius = 0;
		}

		const defaultProps = {
			style: _.merge(this.getInitialStyle().gravatar, gravatarStyle),
		};

		return computeProps(this.props, defaultProps);
	}

	render() {
		const props = this.prepareRootProps();

		const uri = `${GRAVATAR_URI + md5(this.props.email)}?s=${
			props.style.height
		}`;
		return <Image ref={(c) => (this._root = c)} {...props} source={{ uri }} />;
	}
}

Gravatar.propTypes = {
	...Image.propTypes,
	email: PropTypes.string.isRequired,
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
		PropTypes.array,
	]),
	size: PropTypes.number,
	circular: PropTypes.bool,
	square: PropTypes.bool,
};

const StyledGravatar = connectStyle(
	"NativeBase.Gravatar",
	{},
	mapPropsToStyleNames,
)(Gravatar);
export { StyledGravatar as Gravatar };

import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import { Body } from "./../../src/basic/Body";
import { CheckBox } from "./../../src/basic/Checkbox";
import { Content } from "./../../src/basic/Content";
import { ListItem } from "./../../src/basic/ListItem";
import { Text } from "./../../src/basic/Text";

// Note: test renderer must be required after react-native.

jest.mock("Platform", () => {
	const Platform = require.requireActual("Platform");
	Platform.OS = "ios";
	return Platform;
});

it("renders checkbox", () => {
	const tree = renderer
		.create(
			<Content>
				<ListItem button>
					<CheckBox checked={true} />
					<Body>
						<Text>Lunch Break</Text>
					</Body>
				</ListItem>
				<ListItem button>
					<CheckBox color="red" checked={false} />
					<Body>
						<Text>Daily Stand Up</Text>
					</Body>
				</ListItem>
			</Content>,
		)
		.toJSON();
	expect(tree).toMatchSnapshot();
});

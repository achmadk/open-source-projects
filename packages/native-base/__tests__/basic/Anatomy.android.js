import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import { Body } from "./../../src/basic/Body";
import { Button } from "./../../src/basic/Button";
import { Container } from "./../../src/basic/Container";
import { Content } from "./../../src/basic/Content";
import { Footer } from "./../../src/basic/Footer";
import { FooterTab } from "./../../src/basic/FooterTab";
import { Header } from "./../../src/basic/Header";
import { Icon } from "./../../src/basic/Icon";
import { Left } from "./../../src/basic/Left";
import { Right } from "./../../src/basic/Right";
import { Text } from "./../../src/basic/Text";
import { Title } from "./../../src/basic/Title";

// Note: test renderer must be required after react-native.

jest.mock("Platform", () => {
	const Platform = require.requireActual("Platform");
	Platform.OS = "android";
	return Platform;
});

it("renders anatomy", () => {
	const tree = renderer
		.create(
			<Container>
				<Header>
					<Left>
						<Button transparent>
							<Icon name="ios-menu" />
						</Button>
					</Left>
					<Body>
						<Title>Header</Title>
					</Body>
					<Right />
				</Header>

				<Content padder>
					<Text>Content goes here</Text>
				</Content>

				<Footer>
					<FooterTab>
						<Button active full>
							<Text>Footer</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>,
		)
		.toJSON();
	expect(tree).toMatchSnapshot();
});

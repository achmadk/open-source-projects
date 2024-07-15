import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import { Body } from "./../../src/basic/Body";
import { Button } from "./../../src/basic/Button";
import { Container } from "./../../src/basic/Container";
import { Header } from "./../../src/basic/Header";
import { Icon } from "./../../src/basic/Icon";
import { Left } from "./../../src/basic/Left";
import { Right } from "./../../src/basic/Right";
import { Segment } from "./../../src/basic/Segment";
import { Text } from "./../../src/basic/Text";

// Note: test renderer must be required after react-native.

jest.mock("Platform", () => {
	const Platform = require.requireActual("Platform");
	Platform.OS = "android";
	return Platform;
});

it("renders Segments inside Header", () => {
	const tree = renderer
		.create(
			<Container>
				<Header hasSegment>
					<Left>
						<Button transparent>
							<Icon name="arrow-back" />
						</Button>
					</Left>
					<Body>
						<Segment>
							<Button active={true} first>
								<Text>Puppies</Text>
							</Button>
							<Button last active={false}>
								<Text>Cubs</Text>
							</Button>
						</Segment>
					</Body>
					<Right>
						<Button transparent>
							<Icon name="search" />
						</Button>
					</Right>
				</Header>
			</Container>,
		)
		.toJSON();
	expect(tree).toMatchSnapshot();
});

it("renders Segments outside Header", () => {
	const tree = renderer
		.create(
			<Container>
				<Header hasSegment />
				<Segment>
					<Button first active={true}>
						<Text>Puppies</Text>
					</Button>
					<Button active={false}>
						<Text>Kittens</Text>
					</Button>
					<Button last active={false}>
						<Text>Cubs</Text>
					</Button>
				</Segment>
			</Container>,
		)
		.toJSON();
	expect(tree).toMatchSnapshot();
});

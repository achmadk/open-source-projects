import {
	StyleProvider,
	connectStyle,
} from "@achmadk/legacy-native-base-shoutem-theme";
export { Col, Row, Grid } from "@achmadk/react-native-easy-grid";

import { Accordion } from "./basic/Accordion";
import { ActionSheetContainer } from "./basic/Actionsheet";
import { Badge } from "./basic/Badge";
import { Body } from "./basic/Body";
import { Button } from "./basic/Button";
import { Card } from "./basic/Card";
import { CardItem } from "./basic/CardItem";
import { CheckBox } from "./basic/Checkbox";
import { Container } from "./basic/Container";
import { Content } from "./basic/Content";
import { DatePicker } from "./basic/DatePicker";
import { DeckSwiper } from "./basic/DeckSwiper";
import Drawer from "./basic/Drawer";
import { Fab } from "./basic/Fab";
import { Footer } from "./basic/Footer";
import { FooterTab } from "./basic/FooterTab";
import { Form } from "./basic/Form";
import { H1 } from "./basic/H1";
import { H2 } from "./basic/H2";
import { H3 } from "./basic/H3";
import { Header } from "./basic/Header";
import { Icon } from "./basic/Icon";
import { IconNB } from "./basic/IconNB";
import { Input } from "./basic/Input";
import { InputGroup } from "./basic/InputGroup";
import { Item } from "./basic/Item";
import { Label } from "./basic/Label";
import { Left } from "./basic/Left";
import { List } from "./basic/List";
import { ListItem } from "./basic/ListItem";
import { PickerNB } from "./basic/Picker";
import { Radio } from "./basic/Radio";
import { Right } from "./basic/Right";
import { Root } from "./basic/Root";
import { Segment } from "./basic/Segment";
import { Separator } from "./basic/Separator";
import { Spinner } from "./basic/Spinner";
import { Subtitle } from "./basic/Subtitle";
import { SwipeRow } from "./basic/SwipeRow";
import { Switch } from "./basic/Switch";
import { Tab } from "./basic/Tab";
import { TabContainer } from "./basic/TabContainer";
import { TabHeading } from "./basic/TabHeading";
import ScrollableTabView from "./basic/Tabs";
import { DefaultTabBar } from "./basic/Tabs/DefaultTabBar";
import { ScrollableTab } from "./basic/Tabs/ScrollableTabBar";
import { Text } from "./basic/Text";
import { Textarea } from "./basic/Textarea";
import { Thumbnail } from "./basic/Thumbnail";
import { Title } from "./basic/Title";
import { ToastContainer } from "./basic/ToastContainer";
import { ViewNB as View } from "./basic/View";
import setDefaultThemeStyle from "./init";
import getTheme from "./theme/components";
import variables from "./theme/variables/platform";
import VueNativeBase from "./vue-native.js";

setDefaultThemeStyle();
// Theme
export {
	getTheme,
	variables,
	StyleProvider,
	connectStyle,
	Drawer,
	Button,
	DatePicker,
	IconNB,
	Icon,
	Header,
	Form,
	InputGroup,
	Input,
	Title,
	Fab,
	Left,
	Right,
	Body,
	Badge,
	CheckBox,
	Radio,
	Thumbnail,
	Card,
	CardItem,
	H1,
	H2,
	H3,
	Spinner,
	Switch,
	Container,
	Content,
	Footer,
	Tab,
	ScrollableTabView as Tabs,
	FooterTab,
	PickerNB as Picker,
	List,
	ListItem,
	Separator,
	DeckSwiper,
	Item,
	Subtitle,
	Label,
	Textarea,
	Text,
	Content as TabContent,
	View,
	ToastContainer as Toast,
	ScrollableTab,
	ActionSheetContainer as ActionSheet,
	TabHeading,
	TabContainer,
	DefaultTabBar,
	Segment,
	Root,
	SwipeRow,
	VueNativeBase,
	Accordion,
};

const mapPropsToStyleNames = (styleNames, props) => Object.keys(props);

export { mapPropsToStyleNames };

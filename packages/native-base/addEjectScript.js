const printMessage = require("print-message");

printMessage(
  [
    "@achmadk/legacy-native-base has been succesfully installed!",
    "Run `node node_modules/@achmadk/legacy-native-base/ejectTheme.cjs` to copy over theme config and variables.",
    "Head over to the docs for detailed information on how to make changes to the theme."
  ],
  {
    color: "yellow",
    borderColor: "green"
  }
);

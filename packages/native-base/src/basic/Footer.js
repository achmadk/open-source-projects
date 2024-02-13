import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, SafeAreaView } from 'react-native';
import { connectStyle } from '@achmadk/legacy-native-base-shoutem-theme';

import mapPropsToStyleNames from '../utils/mapPropsToStyleNames';
import getStyle from '../utils/getStyle';

class Footer extends Component {
  static contextTypes = {
    theme: PropTypes.object
  };

  render() {
    const { style } = this.props;

    return (
      <SafeAreaView
        style={{
          backgroundColor: getStyle(style).backgroundColor
        }}
      >
        <View ref={c => (this._root = c)} {...this.props} />
      </SafeAreaView>
    );
  }
}

Footer.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array
  ])
};

const StyledFooter = connectStyle(
  'NativeBase.Footer',
  {},
  mapPropsToStyleNames
)(Footer);
export { StyledFooter as Footer };

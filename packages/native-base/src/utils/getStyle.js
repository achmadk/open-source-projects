import _ from 'lodash';

export default function getStyle(style) {
  // style: PropTypes.object | PropTypes.array | PropTypes.number

  // If style is an array, merge the objects in the array
  // to get the final style
  if (_.isArray(style)) {
    return _.reduce(
      style,
      (merged, nextStyle) => ({ ...merged, ...nextStyle }),
      {}
    );
  }

  return style;
};

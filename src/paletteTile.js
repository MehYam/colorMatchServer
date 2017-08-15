const React = require('react');
const ReactDOM = require('react-dom');

class PaletteTile extends React.Component {
   render() {
      const color = this.props.color || 0xffffff;
      const colorHexPad = '000000';
      const colorHex = (colorHexPad + color.toString(16)).slice(-colorHexPad.length);

      const styleF = {
         backgroundColor: '#' + colorHex,
         width: this.props.size,
         height: this.props.size
      };
      const clickHandler = this.props.onClick ? (() => this.props.onClick(this.props.id)) : null;
      return (<div className='paletteTile2' style={styleF} onClick={clickHandler}></div>);
   }
}

module.exports = PaletteTile;
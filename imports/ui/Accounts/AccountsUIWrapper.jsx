import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default class AccountsUIWrapper extends Component {
  componentDidMount() {
    this.view = Blaze.render(Template.loginButtons,
      ReactDOM.findDOMNode(this.refs.container));
  }

  componentWillUnMount() {
    Blaze.remove(this.view);
  }

  render() {
    return <span className="login right blue-text text-darken-2" id="login"><span ref="container" /></span>
  }
}
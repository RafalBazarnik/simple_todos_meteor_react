import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { createContainer } from 'meteor/react-meteor-data';

// import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './Accounts/AccountsUIWrapper.jsx';

Tasks = new Mongo.Collection('tasks');

if(Meteor.isServer){
  Meteor.publish('tasks', function taskPublication() {
    return Tasks.find();
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);
    // console.log(taskId);
    // console.log(this.userId);
    // console.log(Tasks.findOne({_id: taskId}).owner);
    if (this.userId === Tasks.findOne({_id: taskId}).owner) {
      Tasks.remove(taskId);
    }
    else {
      // throw new Meteor.Error('not-authorized');
      Materialize.toast("It's not your task!", 2000);
    }
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
});

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

    toggleHideCompleted() {
      this.setState({
        hideCompleted: !this.state.hideCompleted,
      });
    }


  handleSubmit(event) {
    event.preventDefault();

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call("tasks.insert", text);

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTasks() {
    let filteredTasks = this.props.tasks
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (<Task key={task._id} task={task} />));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1 className="center-align">Todo List -<br /> tasks left to do: <strong>{this.props.incompleteCount}</strong></h1>

            <label className="hide-completed left">
              <input
                type="checkbox"
                readOnly
                checked={this.state.hideCompleted}
                onClick={this.toggleHideCompleted.bind(this)}
                />
              <span>Hide Completed Tasks</span>
            </label>

          <AccountsUIWrapper />
          { this.props.currentUser ?
          <form className="new-task card-panel teal lighten-2" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
          </form> : ''
        }
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    )
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
}

export default createContainer(() => {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);

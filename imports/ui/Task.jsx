import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

export default class Task extends Component {

  toggleChecked() {
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    // Tasks.update(this.props.task._id, {
    //   $set: { checked: !this.props.task.checked },
    // });
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
    // Tasks.remove(this.props.task._id);
  }

  render() {

    const taskClassName = this.props.task.checked ? 'checked' : '';
    return (
      <div class="row">
      <li className="{taskClassName} card-panel cyan accent-1">
      <input
          type="checkbox"
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />

      <span className="text blue-text text-darken-2"><strong>({this.props.task.username}): </strong>{this.props.task.text}</span>
      <button className="delete right" onClick={this.deleteThisTask.bind(this)}>
          &times;
      </button>
    </li>
    </div>
    );
  }
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
};

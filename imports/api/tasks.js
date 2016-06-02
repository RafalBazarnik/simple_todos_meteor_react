import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import App from '../ui/App.jsx';

export const Tasks = new Mongo.Collection('tasks');

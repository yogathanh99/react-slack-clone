import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: 'AIzaSyDoDMtehxAKBAHMlVnYVHXwjRfYL8uPSaQ',
  authDomain: 'react-slack-clone-thanh.firebaseapp.com',
  databaseURL: 'https://react-slack-clone-thanh.firebaseio.com',
  projectId: 'react-slack-clone-thanh',
  storageBucket: 'react-slack-clone-thanh.appspot.com',
  messagingSenderId: '427900153903',
  appId: '1:427900153903:web:d3f93bc759a7a4a50d16da',
  measurementId: 'G-9TR4DE0W1J',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;

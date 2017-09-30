// Initialize Firebase
var config = {
  apiKey: "AIzaSyAhUHPwura_xI3Gl7Qi5QNlor8igP7VWIk",
  authDomain: "boogie-bu.firebaseapp.com",
  databaseURL: "https://boogie-bu.firebaseio.com",
  projectId: "boogie-bu",
  storageBucket: "",
  messagingSenderId: "636626897207"
};
firebase.initializeApp(config);

// database query
let events = firebase.database().ref("events/");

// authenticate admin route
if (document.location.pathname.indexOf('admin') > -1 ) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      // if user is not logged in, redirect to index
      window.location = 'index.html';
    }
  });
}

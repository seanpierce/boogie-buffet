$(function() {

  // get elements
  const emailInput = $('#email');
  const passwordInput = $('#password');
  const logInButton = $('#log-in');
  const logOutButton = $('#log-out');

  // add login event
  logInButton.click(function() {
    // get email and password
    const email = emailInput.val();
    const password = passwordInput.val();
    const auth = firebase.auth();
    // reset input fields
    emailInput.val("");
    passwordInput.val("");

    // log in
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
  });

  // sign out
  logOutButton.click(function() {
    firebase.auth().signOut();
  });

  // add realtime authentication listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    // if user is loged in
    if(firebaseUser) {
      console.log(firebaseUser);
      // else user is null
    } else {
      console.log("Not logged in...");
    }
  });

});

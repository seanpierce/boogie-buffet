// authenticate admin route
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // if user is logged in, redirect to admin
    window.location = 'admin.html';
  }
});

$(function() {

  // get elements
  const emailInput = $('#email-input');
  const passwordInput = $('#password-input');
  const logInForm = $('#log-in-form');

  // add login event
  logInForm.click(function(e) {
    e.preventDefault();
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

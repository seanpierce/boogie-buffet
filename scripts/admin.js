// authenticate admin route
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    // if user is not logged in, redirect to index
    window.location = 'login.html';
  } else {
    $('#username').text(user.email);
  }
});

// create new event function
let create_new_event = function(title, date, time, location, cost, age, image, details, links, ref) {
  let newEvent = ref.push();
  newEvent.set({
    title: title,
    date: date,
    time: time,
    location: location,
    cost: cost,
    age: age,
    image: image,
    details: details,
    links: links
  });
}

// instantiate image url for form submission
let imgURL;

// ------------------------------ document ready
// ------------------------------ document ready
// ------------------------------ document ready

$(function() {
  ref.on("value", function(snapshot) {
    // do something
    snapshot.forEach(function(event) {
      // do something with the events
    });
  }, function (error) {
    console.log("Error: " + error.code);
  });

  // log out
  $('#log-out-link').click(function() {
    firebase.auth().signOut();
  });

  // image upload
  let uploadProgress = $('#upload-progress');
  let fileButton = $('#file-button');
  // listen for file selection
  fileButton.change(function(e) {
    // get file (variable declared above, for use later)
    let file = e.target.files[0];
    // create storage ref
    let storageRef = firebase.storage().ref('images/' + file.name);
    // upload file
    let task = storageRef.put(file);
    // update progress bar
    task.on('state_changed',
      function progress(snapshot) {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploadProgress.css('color', 'inherit');
        uploadProgress.text(Math.floor(percentage) + '%');
      },
      function error(err) {
        console.log(err);
      },
      function complete() {
        uploadProgress.text('Upload Complete');
        uploadProgress.css('color', 'green');
        // once finished, set image url for form submission
        imgURL = task.snapshot.downloadURL;
      }
    );
  });

  // submit new event to database
  $('#new-event').submit(function(e) {
    e.preventDefault();
    let title = $('#new-event-title').val();
    let date = $('#new-event-date').val();
    let time = $('#new-event-time').val();
    let location = $('#new-event-location').val();
    let cost = $('#new-event-title').val();
    let age = $('#new-event-age').val();
    let details = $('#new-event-details').val();
    let links = $('#new-event-links').val();

    create_new_event(title, date, time, location, cost, age, imgURL, details, links, ref);

    // TODO: clear form, alert user that upload was successfull
  });

});

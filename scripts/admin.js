// authenticate admin route
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    // if user is not logged in, redirect to index
    window.location = 'login.html';
  } else {
    $('#username').text(user.email);
  }
});

// display li to admin-events-list
let adminEventDisplay = function(event) {
  let this_key = event.key;
  let this_event = event.val();
  let html =
  `
  <li><span class="delete-event" data-image="${this_event.image}" data-key="${this_key}">✕</span>${this_event.title}, ${convertDateShort(this_event.date)}</li>
  `
  return html
}

// add new event success message
let successMessage = function(eventTitle) {
  $('#success-message').html(`${eventTitle} successfully added!`);
  setTimeout(function() {
    // clear success-message
    $('#success-message').html("");
  }, 10000);
}

// upload complete message
let uploadComplete = function(uploadProgress, filename, imgURL) {
  let fileRef = firebase.storage().ref('images/' + filename);
  uploadProgress.html(`<img src="${imgURL}" class="thumbnail"> - ${filename} <span id="cancel-upload">(cancel)</span>`);
  // cancel (delete) uploaded file
  $('#cancel-upload').click(function() {
    fileRef.delete();
    // reset, clear progress message
    uploadProgress.html('');
  });
}

// create new event function
let create_new_event = function(title, date, time, location, cost, age, image, details, links, ref) {
  let newEvent = ref.push();
  if (newEvent.set({
    title: title,
    date: date,
    time: time,
    location: location,
    cost: cost,
    age: age,
    image: image,
    details: details,
    links: links
  })) {
    successMessage(title);
  };
}

let delete_event = function(key, image, ref) {
  ref.child(key).remove();
}

// instantiate image url for form submission
let imgURL;

// image upload functionality
let imageUpload = function(e) {
  let uploadProgress = $('#upload-progress');
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
      // once finished, set image url for form submission
      imgURL = task.snapshot.downloadURL;
      uploadComplete(uploadProgress, file.name, imgURL);
    }
  );
}

// ------------------------------ document ready
// ------------------------------ document ready
// ------------------------------ document ready

$(function() {
  ref.on("value", function(snapshot) {
    // clear admin events list
    $('#admin-events-list').html('');
    snapshot.forEach(function(event) {
      // list events for admin to delete
      $('#admin-events-list').append(adminEventDisplay(event));
    });
    // delete single event function
    $('.delete-event').click(function() {
      let key = $(this).attr('data-key');
      let image = $(this).attr('data-image');
      let ref = firebase.database().ref("events/");
      if (confirm('Are you sure you want to delete this event?')) {
        delete_event(key, image, ref);
      }
    });
  }, function (error) {
    console.log("Error: " + error.code);
  });

  // log out
  $('#log-out-link').click(function() {
    firebase.auth().signOut();
  });

  let fileButton = $('#file-button');
  // listen for file selection
  fileButton.change(function(e) {
    imageUpload(e);
  });

  // submit new event to database
  $('#new-event').submit(function(e) {
    e.preventDefault();
    // get input values
    let title = $('#new-event-title').val();
    let date = $('#new-event-date').val();
    let time = $('#new-event-time').val();
    let location = $('#new-event-location').val();
    let cost = $('#new-event-cost').val();
    let age = $('#new-event-age').val();
    // image comes from the imgURL variable declared above
    let details = $('#new-event-details').val();
    let links = $('#new-event-links').val();

    create_new_event(title, date, time, location, cost, age, imgURL, details, links, ref);

    // clear form inputs
    $('#new-event')[0].reset();
    $('#new-event-date').removeClass('has-value');
    $('#new-event-time').removeClass('has-value');

    // clear image uploadProgress message
    $('#upload-progress').text('');

  });

});

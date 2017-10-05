// instantiate imgURL to use globally
let imgURL;

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
  <li>
    <span class="delete-event" data-image="${this_event.image}" data-key="${this_key}">✕</span>
    <span class="edit-event" data-key="${this_key}"><img src="assets/pen.png"></span>
    ${this_event.title}, ${convertDateShort(this_event.date)}
  </li>
  `
  return html
}

// add new event success message
let successMessage = function(eventTitle) {
  $('#success-message').html(`${eventTitle}, successfully added!`);
  setTimeout(function() {
    // clear success-message
    $('#success-message').html("");
  }, 10000);
}

// edit event success message
let editSuccessMessage = function(eventTitle) {
  $('#edit-success-message').html(`${eventTitle}, successfully updated!`);
  setTimeout(function() {
    // clear success-message
    $('#edit-success-message').html("");
  }, 10000);
}

// upload complete message
let uploadComplete = function(uploadProgress, filename, imgURL) {
  let fileRef = firebase.storage().ref('images/' + filename);
  uploadProgress.html(`<img src="${imgURL}" class="thumbnail"> - ${filename} <span id="cancel-upload">(cancel)</span>`);
  // cancel (delete) uploaded file
  $('#cancel-upload').click(function() {
    fileRef.delete();
    // reset file-button value
    $('#file-button').val("");
    // reset, clear progress message
    uploadProgress.html('');
  });
}

// create new event function
let create_new_event = function(event_details, image, ref) {
  let newEvent = ref.push();
  if (newEvent.set({
    title: event_details.title,
    date: event_details.date,
    time: event_details.time,
    location: event_details.location,
    cost: event_details.cost,
    age: event_details.age,
    details: event_details.details,
    links: event_details.links,
    image: image
  })) {
    successMessage(event_details.title);
  };
}

// delete single event
let delete_event = function(key, image, ref) {
  ref.child(key).remove();
  let imageRef = firebase.storage().refFromURL(image);
  // delete associated image along with event
  imageRef.delete().then(function() {
    // file deleted successfully
  }).catch(function(err) {
    console.log(err);
  });
}

// set event edits in database
let edit_event = function(event_details, currentEventKey, imgURL) {
  // query db for event using key, set values
  firebase.database().ref(`events/${currentEventKey}`).set({
    title: event_details.title.val(),
    date: event_details.date.val(),
    time: event_details.time.val(),
    location: event_details.location.val(),
    cost: event_details.cost.val(),
    age: event_details.age.val(),
    details: event_details.details.val(),
    links: event_details.links.val(),
    image: imgURL
  });
  // show success message
  editSuccessMessage(event_details.title.val());
}

// show and set values for edit event form
let showEditEventForm = function(snapshot) {
  $('#edit-modal').fadeIn(125);
  let currentEventKey = snapshot.key;
  let event = snapshot.val();
  let imgURL = event.image;
  let currentImageRef = firebase.storage().refFromURL(event.image);
  // create object to store and pass values
  let event_details = new Object();
  // set form values equal to current event values
  $('#edit-event-title-span').text(`${event.title}`);
  $('#edit-event').find('.upload-progress').html(`<img src="${event.image}" class="thumbnail"> - ${currentImageRef.name}`);

  event_details.title = $('#edit-event-title').val(`${event.title}`);
  event_details.date = $('#edit-event-date').val(`${event.date}`);
  event_details.time = $('#edit-event-time').val(`${event.time}`);
  event_details.location = $('#edit-event-location').val(`${event.location}`);
  event_details.cost = $('#edit-event-cost').val(`${event.cost}`);
  event_details.age = $('#edit-event-age').val(`${event.age}`);
  event_details.details = $('#edit-event-details').val(`${event.details}`);
  event_details.links = $('#edit-event-links').val(`${event.links}`);
  event_details.image = imgURL;

  // change event image
  $('#edit-file-button').change(function(e) {
    let form = $('#edit-event');
    //TODO: delete current image
    // uploads image to storage
    imageUpload(e, form);
    //TODO: reset current image
  });

  $('#edit-event').submit(function(e) {
    e.preventDefault();
    edit_event(event_details, currentEventKey, imgURL);
  });

  // close edit modal
  $('.close-edit-form').click(function() {
    $('#edit-modal').fadeOut(125);
  });
}

// purge old events
let purgeOldEvents = function(events) {
  events.forEach(function(event) {
    if (Date.parse(event.val().date) < Date.now()) {
      let key = event.key
      let image = event.val().image
      let ref = firebase.database().ref("events/");
      delete_event(key, image, ref);
    }
  });
}

// image upload functionality
let imageUpload = function(e, form) {
  let uploadProgress = form.find('.upload-progress');
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

// if user uploads an image, but then tries to refresh page, delete image
let confirmRefresh = function(fileButton) {
  window.onbeforeunload = function(event) {
    if (fileButton.val() != "") {
      return confirm("You haven't finished adding the new event. Continue?");
    }
  };
}

// ------------------------------ document ready
// ------------------------------ document ready
// ------------------------------ document ready

$(function() {
  let now = Date.now();
  ref.orderByChild('date').on("value", function(snapshot) {
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
    // edit event click handler
    $('.edit-event').click(function() {
      let key = $(this).attr('data-key');
      let eventRef = firebase.database().ref(`events/${key}`);
      // query the db for this event
      eventRef.on("value", function(snapshot) {
        // call edit function, pass
        showEditEventForm(snapshot);
      });
    });

  }, function (error) {
    console.log("Error: " + error.code);
  });

  // purge old events click handler
  $('#purge-old-events').click(function() {
    if (confirm('Are you sure you\'d like to purge old events?')) {
      ref.on("value", function(snapshot) {
        purgeOldEvents(snapshot);
      });
    }
  });

  // log out
  $('#log-out-link').click(function() {
    firebase.auth().signOut();
  });

  let fileButton = $('#file-button');
  // listen for new event image selection
  fileButton.change(function(e) {
    let form = $('#new-event');
    imageUpload(e, form);
    confirmRefresh(fileButton);
  });

  // submit new event to database
  $('#new-event').submit(function(e) {
    e.preventDefault();
    // create event details object
    let event_details = new Object;
    // get input values
    event_details.title = $('#new-event-title').val();
    event_details.date = $('#new-event-date').val();
    event_details.time = $('#new-event-time').val();
    event_details.location = $('#new-event-location').val();
    event_details.cost = $('#new-event-cost').val();
    event_details.age = $('#new-event-age').val();
    event_details.details = $('#new-event-details').val();
    event_details.links = $('#new-event-links').val();
    // image comes from the imgURL variable declared globally
    create_new_event(event_details, imgURL, ref);

    // clear form inputs
    $('#new-event')[0].reset();
    $('#new-event-date').removeClass('has-value');
    $('#new-event-time').removeClass('has-value');

    // clear image uploadProgress message
    $('.upload-progress').text('');
  });

});

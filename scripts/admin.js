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

// delete event
let functionality_for_deletable_events = function(events) {
  // delete item
  // can only be applied after items are printed
  $('.delete_item').click(function() {
    let key = $(this).attr('data-key');
    if (confirm('Are you sure you want to delete this item?')) {
      delete_item(ref, key);
    }
  });
}
let delete_item = function(ref, key) {
  ref.child(key).remove();
}

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

  // submit new event
  $('#new-event').submit(function(e) {
    e.preventDefault();
    let title = $('#new-event-title').val();
    let date = $('#new-event-date').val();
    let time = $('#new-event-time').val();
    let location = $('#new-event-location').val();
    let cost = $('#new-event-title').val();
    let age = $('#new-event-age').val();
    let image = $('#new-event-image').val();
    let details = $('#new-event-details').val();
    let links = $('#new-event-links').val();

    create_new_event(title, date, time, location, cost, age, image, details, links, ref);
    $('#new-event').trigger('reset');
  });

});

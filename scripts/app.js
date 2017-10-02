// display event to #events div
let display_event = function(event) {
  let key = event.key;
  let this_event = event.val();
  let html =
    `
    <div class="event" data-key="${key}">
      <img src="${this_event.image}" class="event-image">
      <ul class="hover-details">
        <li class="event-title">${this_event.title}</li>
        <li class="event-date">${this_event.date}</li>
        <li class="event-time">${this_event.time}</li>
        <li class="event-cost">$${this_event.cost}</li>
        <li class="event-location">${this_event.location}</li>
        <li class="event-age">${this_event.age}</li>
      </ul>
    </div>
    `
  return html;
}

// display events overlay
let viewEventDetails = function(event) {
  let this_event = event.val();
  $('#overlay').show();
  $('#overlay-content').html(
    `
    <img src="assets/x.png" class="close-overlay">
    <img src="${this_event.image}" class="event-image">
    <h1>${this_event.title}</h1>
    <ul>
      <li>${convertDate(this_event.date)} at ${convertTime(this_event.time)}</li>
      <li>${this_event.location}</li>
      <li>${(this_event.cost)!=''?'$'+this_event.cost:'Free'}</li>
      <li>${this_event.age}</li>
    </ul>
    <p>${this_event.details}</p>
    `
  );
}

// convert 24 hour time to standard time
let convertTime = function(time) {
  return moment(time, 'HH:mm:ss').format('h:mm A');
}
// convert js standard date to friendlier format
let convertDate = function(date) {
  return moment(date, 'YYYY-MM-DD').format("dddd, MMM Do, YYYY")
}


// ------------------------------ document ready
// ------------------------------ document ready
// ------------------------------ document ready

$(function() {
  ref.on("value", function(snapshot) {
    // hide loading animation
    $('#loading').hide();
    // erase all prev events
    $('.event').remove();
    snapshot.forEach(function(event) {
      // print events to page
      $('#events').append(display_event(event));
      // click function for events
      $('.event').click(function() {
        // function to display event as overlay
        viewEventDetails(event);
        $('.close-overlay').click(function() {
          $('#overlay').hide();
        });
      });
    });
  }, function (error) {
    console.log("Error: " + error.code);
  });
});

// display event to #events div
let display_event = function(event) {
  let key = event.key;
  let this_event = event.val();
  let html =
    `
    <div class="event" data-key="${key}" style="background-image:url(${this_event.image});">
      <div class="event-content-hover-overlay">
        <ul class="hover-details">
          <li class="event-title">${this_event.title}</li>
          <li class="event-date">${convertDateShort(this_event.date)}</li>
        </ul>
      </div>
    </div>
    `
  return html;
}

// display events overlay
let viewEventDetails = function(event) {
  let this_event = event.val();
  $('#overlay').fadeIn(125);
  $('#overlay-content').html(
    `
    <img src="assets/x.png" class="close-overlay">
    <img src="${this_event.image && this_event.image}" class="event-image">
    <h1>${this_event.title && this_event.title}</h1>
    <ul>
      <li>${this_event.date && convertDate(this_event.date)}${(this_event.date && this_event.time)? " at ":""}${this_event.time && convertTime(this_event.time)}</li>
      <li>${this_event.location && this_event.location}</li>
      <li>${this_event.cost && this_event.cost}</li>
      <li>${this_event.age && this_event.age}</li>
    </ul>
    <p class="details">${this_event.details && this_event.details}</p>
    `
  );
}

// initialize shrimpy disco track
let track = new Audio();
let trackIsPlaying = false;
track.src = 'assets/shrimpy.mp3';
track.loop = true;

// toggle shrimpy disco
let shrimpyDisco = () => {
  $('body').toggleClass('black');
  $('.event').toggleClass('white-boarder');
  $('#shrimpy-disco').toggleClass('shrimpy-disco');
  if (!trackIsPlaying) {
    trackIsPlaying = true;
    track.play();
    curtainsOut();
  } else {
    trackIsPlaying = false;
    track.currentTime = 0;
    track.pause();
    curtainsIn();
  }
}

// move curtains on shrimpy disco toggle
let curtainsOut = () => {
  let offset = $('.curtain-l').width() + 20;
  $('.curtain-l').css('transform', 'translateX(-' + offset + 'px)');
  $('.curtain-r').css('transform', 'translateX(' + offset + 'px)');
}
let curtainsIn = () => {
  $('.curtain-l').css('transform', 'translateX(0px)');
  $('.curtain-r').css('transform', 'translateX(0px)');
}

// ------------------------------ document ready
// ------------------------------ document ready
// ------------------------------ document ready

$(() => {
  let now = Date.now();
  // retrieve events by date
  ref.orderByChild('date').on('value', function(snapshot) {
    // hide loading animation
    $('#loading').hide();
    // show content
    $('.container').removeClass('wait');
    // erase all prev events
    $('.event').remove();
    // create past events array
    let past_events = [];
    snapshot.forEach(function(event) {
      // if event has not happened yet
      if (Date.parse(event.val().date) > Date.now()) {
        // print event to page
        $('#upcoming-events').append(display_event(event));
        // else (event has already happened)
      } else {
        // print event to page
        past_events.push(1);
        $('#past-events').append(display_event(event));
      }
    });
    if (past_events.length == 0) {
      $('#past-events').hide();
    }
    // display event modal on click
    $('.event').click(function() {
      let key = $(this).attr('data-key');
      let eventRef = firebase.database().ref(`events/${key}`);
      eventRef.on('value', function(snapshot) {
        // populate overlay modal with event details
        viewEventDetails(snapshot);
        // close overlay modal when "X" is clicked
        $('.close-overlay').click(function() {
          $('#overlay').fadeOut(125);
        });
      });
    });
  }, function (error) {
    console.log("Error: " + error.code);
  });

  // toggle shrimpy disco on click
  $('.shrimpy').click( () => {
    shrimpyDisco();
  });
  // toggle shrimpy eating that burg'
  $('.shrimpy').mouseover(() => {
    $('.shrimpy').attr('src', 'assets/shrimpy-bite.png');
    setTimeout(() => {
      $('.shrimpy').attr('src', 'assets/shrimpy.png');
    }, 300);
  });
});

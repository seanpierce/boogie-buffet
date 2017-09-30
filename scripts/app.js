// display event to #event div
let display_event = function(event) {
  let key = event.key;
  let this_event = event.val();
  let html =
    `
    <div class="event" id="${key}">
      <img src="${this_event.image}">
    </div>
    `
  return html;
}

// ------------------------------ document ready
// ------------------------------ document ready
// ------------------------------ document ready

$(function() {
  ref.on("value", function(snapshot) {
    // erase all prev events
    $('.event').remove();
    snapshot.forEach(function(event) {
      // print events to page
      $('#events').append(display_event(event));
    });
  }, function (error) {
    console.log("Error: " + error.code);
  });
});

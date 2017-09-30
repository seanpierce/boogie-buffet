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

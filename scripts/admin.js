// authenticate admin route
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    // if user is not logged in, redirect to index
    window.location = 'index.html';
  }
});

// image uploader
let uploader = function() {
  // get elements
  let uplaoder = $('#uploader');
  let fileButton = $('#fileButton');
  let message = $('#message');
  let element = $('#img-container');
  // listen for file selection
  fileButton.addEventListener('change', function(e) {

    // get file
    let file = e.target.files[0];

    // create storage ref
    let storageRef = firebase.storage().ref('uploads/' + file.name);

    // uploade file
    let uploading = storageRef.put(file).then(function(snapshot) {
      let imgUrl = snapshot.downloadURL;
      // append image to page
      element.innerHTML = "<img src='" + imgUrl + "'>";
    }).catch(function(err) {
      console.log(err);
    });

    // create task to show progress
    let task = storageRef.put(file);

    // update progress bar
    task.on('state_changed',

      function progress(snapshot) {
        // this will update progress bar
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploader.value = percentage;
        message.style.display ='none';
      },
      function error(err) {
        // error handling
        message.style.display ='block';
        message.innerHTML ='Failed to upload file!';
      },
      function complete() {
        // executes when file is finished uploading
        message.style.display ='block';
        message.innerHTML ='Upload Successful!';
      }

    );
  });
}

// ------------------------------ document ready
// ------------------------------ document ready
// ------------------------------ document ready

$(function() {
  ref.on("value", function(snapshot) {
    $('.event').remove();
    snapshot.forEach(function(event) {
      // do something with the events
    });
  }, function (error) {
    console.log("Error: " + error.code);
  });
});

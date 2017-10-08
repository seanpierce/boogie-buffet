## Boogie Buffet

<i>Boogie Buffet</i> is a productions company based in Portland, Oregon. This repo contains the project files for the <i>Boogie Buffet</i> website. Assets and design by <a href="http://www.e--rock.com/">Eric Mast</a>, development and custom CMS implementation by <a href="https://github.com/seanpierce">Sean Pierce</a>

### Usage
* <a href="https://github.com/seanpierce/boogie-buffet/archive/master.zip">Download</a> this repo
* Create a new firebase project. If you do not have an account, <a href="firebase.google.com">create one</a>
* In the firebase console, click the "Database" link in the left sidebar. Then, click the 3 dots on the top right of your database tab. Select "Import JSON" from the dropdown menu. Upload the "seed.json" file located in the root of this repo.
* Next, create a directory called "inc" in the root of this repo, within that directory create a file called "firebase.js"
* Paste the following code into firebase.js, **replace the necessary fields with your own database info** (this info is located in the "Overview" tab of the firebase console, click "Add Firebase to your web app")

```javascript
// Initialize Firebase
var config = {
  apiKey: "YOUR API KEY",
  authDomain: "YOUR AUTH DOMAIN",
  databaseURL: "YOUR DATABASE URL",
  projectId: "YOUR PROJECT ID",
  storageBucket: "YOUR STORAGE BUCKET",
  messagingSenderId: "YOUR MESSAGING SENDER ID"
};
firebase.initializeApp(config);

// database query
let ref = firebase.database().ref("events/");
```


<img src="assets/lil-shrimp-01.png">

// Initialize Firebase
// Get the code provided from Google Firebase's
// Paste the var config = {...}; part here
// Also keep the firebase.initializeApp(...); part
// The <script> </script> portion we will put in the <head> section of our index.html

// Store a reference to the red and green buttons so we can easily add
//  click events to them later
const redButton = document.querySelector(".myButtonRed");
const greenButton = document.querySelector(".myButtonGreen");
const orangeButton = document.querySelector(".myButtonOrange");

// Store a reference to where we will display the color we get back
//  from the database
const colorContent = document.querySelector("#color-square");
const colorDescription = document.querySelector("#color-description");

// score variable
let score = 0;

//Red Button Click Event
redButton.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("Red Button Pressed.");
  //Put your code here to update the firebase database with color red.
  colorContent.style.backgroundColor = "#de1000";
  colorDescription.innerHTML = "Red";
});

//Green Button Click Event
greenButton.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("Green Button Pressed.");
  //Put your code here to update the firebase database with color green.
  colorContent.style.backgroundColor = "#15ba10";
  colorDescription.innerHTML = "Green";
});

// Orange Button click event
orangeButton.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("Orange Button Pressed.");
  //Put your code here to update the firebase database with color green.
  colorContent.style.backgroundColor = "#de7610";
  colorDescription.innerHTML = "Orange";
});

// Initialize database thingy
const firebaseConfig = {
  LOL: "SECRET! :)",
};

firebase.initializeApp(firebaseConfig);

// test message
const testMessage = document.querySelector("#testMessage");
const db = firebase.firestore();
const testDBRef = db.collection("testCollection").doc("testDoc");
testDBRef.onSnapshot((doc) => {
  let message = doc.data().message;
  testMessage.innerHTML = message;
});

// button changes db value
const testButton = document.querySelector(".myButtonTest");
// test button 2
testButton.addEventListener("click", (e) => {
  e.stopPropagation();
  var JSONobj = {};
  var messageObj = {};
  messageObj.text = "Maybe";
  messageObj.color = "#0000FF";
  JSONobj = {
    "messages.message1": messageObj,
  };
  testDBRef.update(JSONobj);
});

// testButton.addEventListener("click", (e) => {
//   e.stopPropagation();
//   var JSONobj = {};
//   JSONobj.message = "Yes!";
//   testDBRef.update(JSONobj);
// });

// messages, nested messages
const testMessages = document.querySelector("#testMessage2");

testDBRef.onSnapshot((doc) => {
  let message = doc.data().messages.message1.text;
  let message2 = doc.data().messages.message2.text;
  let color = doc.data().messages.message1.color;
  let color2 = doc.data().messages.message2.color;
  testMessage.innerHTML = message;
  testMessage2.innerHTML = message2;
  testMessage.style.color = color;
  testMessage2.style.color = color2;
});

// realtime listener
const mostExpensive = document.querySelector("#mostExpensive");
db.collection("toyCollection")
  .orderBy("price", "desc")
  .limit(1)
  .onSnapshot((querySnapshot) => {
    mostExpensive.innerHTML = "";
    querySnapshot.forEach((doc) => {
      mostExpensive.innerHTML +=
        "The most expensive toy is: " + doc.id + " $" + doc.data().price;
    });
  });

// color add to database

// color database collection
const colorDB = db.collection("data").doc("style");

redButton.addEventListener("click", (e) => {
  e.stopPropagation();
  var JSONobj = {};
  JSONobj = {
    colorValue: "#de1000",
    colorDescription: "Red",
  };
  updateScore(-5);
  colorDB.update(JSONobj);
});

greenButton.addEventListener("click", (e) => {
  e.stopPropagation();
  var JSONobj = {};
  JSONobj = {
    colorValue: "#15ba10",
    colorDescription: "Green",
  };
  updateScore(5);
  colorDB.update(JSONobj);
});

orangeButton.addEventListener("click", (e) => {
  e.stopPropagation();
  var JSONobj = {};
  JSONobj = {
    colorValue: "#de7610",
    colorDescription: "Orange",
  };
  updateScore("reset");
  colorDB.update(JSONobj);
});

// real time listener
colorDB.onSnapshot((doc) => {
  let color = doc.data().colorValue;
  let description = doc.data().colorDescription;
  colorDescription.innerHTML = description;
  colorContent.style.backgroundColor = color;
});

// score thing
// score object

async function updateDatabase(username, value) {
  let userDB = db.collection("users").doc(username);
  let usercollection = db.collection("users");

  // update value if exists, create a new one if does not

  const doc = await userDB.get();
  // does not exist
  if (!doc.exists) {
    var JSONobj = {};
    JSONobj = {
      score: value,
    };
    usercollection.doc(username).set(JSONobj);
  }
  // exists
  else {
    var JSONobj = {};
    JSONobj = {
      score: value,
    };
    userDB.update(JSONobj);
  }
}

// updates the score
function updateScore(value) {
  let scoreContainer = document.getElementById("my-score");
  if (value == "reset") {
    score = 0;
  } else {
    score += value;
  }
  scoreContainer.innerHTML = score;

  // username
  let username = document.getElementById("userName");
  updateDatabase(username.value, score);
  updateTop();
}

// updates the top score
function updateTop() {
  let topScoreContainer = document.getElementById("top-score-info");

  db.collection("users")
    .orderBy("score", "desc")
    .limit(1)
    .onSnapshot((querySnapshot) => {
      topScoreContainer.innerHTML = "";
      console;
      querySnapshot.forEach((doc) => {
        topScoreContainer.innerHTML =
          "Top Score is: " + doc.id + " by " + doc.data().score + "🍔";
      });
    });
}

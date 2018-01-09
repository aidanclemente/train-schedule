  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCNJhA9bpX8OAaVBjqUIDT3-FQKujQu2Ys",
    authDomain: "train-time-c096d.firebaseapp.com",
    databaseURL: "https://train-time-c096d.firebaseio.com",
    projectId: "train-time-c096d",
    storageBucket: "",
    messagingSenderId: "1047629063393"
  };

  firebase.initializeApp(config);


var database = firebase.database();
var ref = database.ref();

var name;
var desitnation;
var firstTrain;
var frequency;

//Displays the current time - Need to update with Firebase every min
var currentTime = moment(currentTime).format("hh:mm a");
console.log(currentTime);

$("#currentTime").html("The Current Time is: " + currentTime);

$("#formSubmit").on("click", function() {


  if (name == "") {
    alert("Please enter the name of the train.");
  } else if (desitnation == "") {
    alert("Please enter the desitnation of the train.");
  } else if (firstTrain == "") {
    alert("Please enter the time the first train arrives.");
  } else if (frequency == "") {
    alert("Please enter the frequency the train arrives.");
  } else {

      name = $("#name-input").val().trim();
      desitnation = $("#destination-input").val().trim();
      firstTrain = $("#firstTrain-input").val().trim();
      frequency = $("#frequency-input").val().trim();

      console.log("First train arrives: " + firstTrain);
      console.log("frequecy: " + frequency);


      ref.push({
        name: name,
        desitnation: desitnation,
        firstTrain: firstTrain,
        frequency: frequency,
        // dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
  }

})  

ref.on("child_added", function(snapshot) {

  console.log(moment(snapshot.val().firstTrain));

    // First Train: Subtract 1 year to make sure it comes before current time
  var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
  console.log(firstTrainConverted);
  
  // Time difference between current time and firstTrainConverted
  var timeDiff = moment().diff(moment(firstTrainConverted), "minutes");
  console.log("Time Difference: " + timeDiff);

  // Remainder of minutes until next train
  var minRemainder = timeDiff % frequency;
  console.log(minRemainder);

  // Minutes left until next train 
  var minNextTrain = frequency - minRemainder;
  console.log("Train arrival in " + minNextTrain + " minutes")

  var nextTrainArrival = moment().add(minNextTrain, "minutes");
  console.log("The next train " + moment(nextTrainArrival).format("hh:mm a"));


  var newRow = $("<tr>");

  var newDiv = $("<td>");

  //This is not working correctly
  newRow.append("<td>" + snapshot.val().name + "</td> <td>" + snapshot.val().destination + "</td> <td>" + snapshot.val().frequency + "</td> <td>" + moment(nextTrainArrival).format("LT") + "</td> <td>" + minNextTrain + "</td>");

  $("#userData").append(newRow);
  
  $(".row").append(newDiv);

})


//++++ Store in Firebase: ++++++++++

//Train Name
// Desitnation
//Frequency
//+++++++++++++++ Need Help here!!! +++++++++++++++++++++++++++
//Next Arrival Time
//Minutes Away
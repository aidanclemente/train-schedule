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
var destination;
var firstTrain;
var frequency;

//Displays the current time - Need to update with Firebase every min
var currentTime = moment(currentTime).format("hh:mm");
console.log(currentTime);

$("#currentTime").html("The Current Time is: " + currentTime);

$("#formSubmit").on("click", function() {

  //if ($("#trains")[2].checkValidity()) { console.log('valid');} else { console.log('invalid')};

//Source: https://stackoverflow.com/questions/11866910/how-to-force-a-html5-form-validation-without-submitting-it-via-jquery

//This is giving an error    
var $trainsForm = $('#trains');
// console.log("trains: ", $('(#trains[0])[2]'));
if(! ($trainsForm[0])[2].checkValidity()) {
  // If the form is invalid, submit it. The form won't actually submit;
  // this will just cause the browser to display the native HTML5 error messages.
  $trainsForm.find(':submit').click();
}

  if ($("#name-input").val() == "") {

    alert("Please enter the name of the train.");

  } else if ($("#destination-input").val() == "") {

    alert("Please enter the destination of the train.");

  } else if ($("#firstTrain-input").val() == "") {

    alert("Please enter the time the first train arrives.");

  }  else if ($("#frequency-input").val() == "") {

    alert("Please enter the frequency the train arrives.");
    
  } else if ($("#firstTrain-input").val().match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {

      name = $("#name-input").val().trim();
      destination = $("#destination-input").val().trim();
      firstTrain = $("#firstTrain-input").val().trim();
      frequency = $("#frequency-input").val().trim();

      console.log("First train arrives: " + firstTrain);
      console.log("frequecy: " + frequency);
      console.log("value for first train: ", $("#firstTrain-input").val());

      $("#name-input").val("");
      $("#destination-input").val("");
      $("#firstTrain-input").val("");
      $("#frequency-input").val("");

      ref.push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
      });
  }

})  

ref.on("child_added", function(snapshot) {

  console.log("FirstTrain: " + snapshot.val().firstTrain);

    // First Train: Subtract 1 year to make sure it comes before current time
  var firstTrainConverted = moment(snapshot.val().firstTrain, "hh:mm").subtract(1, "years");
  console.log("Converted: " + firstTrainConverted);
  
  // Time difference between current time and firstTrainConverted
  var timeDiff = moment().diff(firstTrainConverted, "minutes");
  console.log("Time Difference: " + timeDiff);

  // Remainder of minutes until next train
  var minRemainder = timeDiff % snapshot.val().frequency;
  console.log(minRemainder);

  // Minutes left until next train 
  var minNextTrain = snapshot.val().frequency - minRemainder;
  console.log("Train arrival in " + minNextTrain + " minutes")

  var nextTrainArrival = moment().add(minNextTrain, "minutes");
  console.log("The next train " + nextTrainArrival.format("hh:mm a"));


  var newRow = $("<tr>");

  var newDiv = $("<td>");

  newRow.append("<td>" + snapshot.val().name + "</td> <td>" + snapshot.val().destination + "</td> <td>" + snapshot.val().frequency + "</td> <td>" + moment(nextTrainArrival).format("LT") + "</td> <td>" + minNextTrain + "</td> <td> <button keyID= '" + snapshot.key + "' class='delete'>" + "Delete" + "</button> </td>");

  $("#userData").append(newRow);
  
  $(".row").append(newDiv);

})

$(document).on("click", ".delete", function(event) {
  event.preventDefault();
  ref.child($(this).attr("keyID")).remove();
  location.reload();
})

//++++ Store in Firebase: ++++++++++

//Train Name
// destination
//Frequency
//+++++++++++++++ Need Help here!!! +++++++++++++++++++++++++++
//Next Arrival Time
//Minutes Away
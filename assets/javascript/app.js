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
var currentTime = moment(currentTime).format("hh:mm:ss");
console.log(currentTime);

$("#currentTime").html("The Current Time is: " + currentTime);


$("#formSubmit").on("click", function() {

  var nameInput = $("#name-input").val();
  var destInput = $("#destination-input").val();
  var firstTrn = $("#firstTrain-input").val();
  var frq = $("#frequency-input").val();
  var regEx = RegExp("^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$");

  if (nameInput == "") {
      alert("Please enter the name of the train.");

  } else if (destInput == "") {
      alert("Please enter the destination of the train.");

  } else if (firstTrn == "") {
      alert("Please enter the time the first train arrives.");

  } else if (regEx.test(firstTrn) == false) {
      alert("Please enter a valid military time.");

  }  else if (frq == "") {
      alert("Please enter the frequency the train arrives.");

  } else if (firstTrn.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {

      name = nameInput.trim();
      destination = destInput.trim();
      firstTrain = firstTrn.trim();
      frequency = frq.trim();

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
        frequency: frequency,
        currentTime: currentTime
      });
  }

});  

//Adding commas to numbers
//Source: https://blog.tompawlak.org/number-currency-formatting-javascript
function formatNumber (num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
};

ref.on("child_added", function(snapshot) {

  var fbName = snapshot.val().name;
  var fbDest = snapshot.val().destination;
  var fbFreq = snapshot.val().frequency;
  var formattedFbFreq = formatNumber(snapshot.val().frequency);
  var fbTrn = snapshot.val().firstTrain;

  console.log("FirstTrain: " + fbTrn);

// First Train: Subtract 1 year to make sure it comes before current time
  var firstTrainConverted = moment(fbTrn, "hh:mm").subtract(1, "years");
  console.log("Converted: " + firstTrainConverted);
  
// Time difference between current time and firstTrainConverted
  var timeDiff = moment().diff(firstTrainConverted, "minutes");
  console.log("Time Difference: " + timeDiff);

// Remainder of minutes until next train
  var minRemainder = timeDiff % fbFreq;
  console.log(minRemainder);

// Minutes left until next train 
  var minNextTrain = fbFreq - minRemainder;
  console.log("Train arrival in " + minNextTrain + " minutes")

  var nextTrainArrival = moment().add(minNextTrain, "minutes");
  var formattedNextTrain =  nextTrainArrival.format("hh:mm a");
  console.log("The next train " + formattedNextTrain);

//Create dynamic elements 
  var newRow = $("<tr>");
  var newDiv = $("<td>");

//Adding information to the dynamic table elements
  newRow.append("<td>" + fbName + "</td> <td>" + fbDest + "</td> <td>" + formattedFbFreq + "</td> <td>" + formattedNextTrain + "</td> <td>" + minNextTrain + "</td> <td> <button keyID= '" + snapshot.key + "' class='delete'>" + "Delete" + "</button> </td>");

//Append to HTML
  $("#userData").append(newRow);
 // $(".row").append(newDiv);

});

//Event handler for delete buttons
$(document).on("click", ".delete", function(event) {
  event.preventDefault();
  ref.child($(this).attr("keyID")).remove();
  location.reload();
});

//Date Time Display
//Source: https://stackoverflow.com/questions/10590461/dynamic-date-and-time-with-moment-js-and-setinterval
var datetime = null,
        date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
    datetime = $('#currentTime')
    update();
    setInterval(update, 1000);
});
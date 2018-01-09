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

var name;
var desitnation;
var firstTrain;
var frequency;

//Displays the current time - Need to update with Firebase every min
var currentTime = moment();

$("#currentTime").html("The Current Time is: " + moment(currentTime).format("hh:mm a"));

$("#formSubmit").on("click", function() {
  name = $("#name-input").val().trim();
  desitnation = $("#destination-input").val().trim();
  firstTrain = $("#firstTrain-input").val().trim();
  frequency = $("#frequency-input").val().trim();

  database.ref().push({
    name: name,

    desitnation: desitnation,

    firstTrain: firstTrain,

    frequency: frequency,

    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

})  

//Adds commas to numbers
//Source: https://blog.tompawlak.org/number-currency-formatting-javascript
function formatNumber (num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}


database.ref().on("child_added", function(snapshot) {


  // console.log(moment(snapshot.val().firstTrain).toNow());
  console.log(moment(snapshot.val().firstTrain).diff(moment(), "minutes"));

  var convertedTime = moment(snapshot.val().firstTrain).diff(moment(), "minutes");

  var monthFormat = moment(snapshot.val().firstTrain).format("MM/DD/YYYY");

  var newRow = $("<tr>");

  //var newDiv = $("<td>");
  newRow.append("<td>" + snapshot.val().name + "</td> <td>" + snapshot.val().destination + "</td> <td>" + monthFormat + "</td> <td>" + monthsWorked + "</td> <td>" + "$" + formatNumber(snapshot.val().monthlyRate) + "</td> <td>" + "$" + formatNumber(monthsWorked * snapshot.val().monthlyRate) + "</td>");

  $("#userData").append(newRow);
  
  // $(".row").append(newDiv);

})
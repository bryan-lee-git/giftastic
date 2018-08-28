// GIPHY API Gif Search Web

// Initial array of gifs
var gifs = ["Debugging", "Coding", "Web Dev", "Punching Computer", "Coding Frustration"];

// Starting and eding indexes for iterating through GIPHY API Response Data
var startingIndex = 1;
var endingIndex = 5;

//  prevent default submit button action
$("#gif-form").submit(function(e) {
  e.preventDefault();
})

// Function for displaying array data in buttons
function renderButtons() {
  $("#gifs-view").empty();
  for (let i = 0; i < gifs.length; i++) {
    var $button = $("<button class='gif-button'>");
    $button.addClass("gif btn");
    $button.attr("data-gifTopic", gifs[i]);
    $button.text(gifs[i]);
    $("#gifs-btns").append($button);
  }
}

// This function handles events where one button is clicked
$("#add-gif").on("click", function() {

  // assign user input value to a variable
  var gifData = $("#gif-input").val();

  // If nothing was input by the user before submit, alert an error
  if (gifData === "") {
    alert("Invalid Input. Try Again");
  } 

  // if there is data, add it to a button in the button area
  else {
    gifs.push(gifData);
    var newGifBtn = $("<button class='gif-button gif btn'>" + gifData + "</button>");
    $("#gifs-btns").append(newGifBtn);
    newGifBtn.attr("data-gifTopic", gifData);
  }
})

// Calling the renderButtons function to display the initial list of gifs
renderButtons();

// GIF topic button functionality
$(document).on("click", ".gif", function() {

  //  reset starting and ending indexes for new topic
  startingIndex = 1;
  endingIndex = 5;

  //empty out the gif and instructions display
  $("#gifs-view").empty();
  $("#instructions-div").empty();

  // hide the footer so that it does not overlap content
  $(".footer").fadeOut(200);

  // create variable to hold the data value and run through the API call function
  var gif = $(this).attr('data-gifTopic');

  // empty out topic display area
  $("#topic-div").empty();

  // add new topic to topic display area
  $("#topic-div").prepend("Selected Topic: " + gif);

  // console log the object to make sure it is being assigned to the variable correctly
  console.log(gif);

  // run the GIF API Call function using the gif variable
  getGifData(gif);

  // fade the new gif data in
  $("#gifs-view").fadeIn(400);
})

//  Function for populating GIF stills on search
function getGifData(gifTopic) {
  
  // display intructions in instructions area
  var instructions = $("<h3 id='instructions'>" + "Click to View the Animated Version / Reclick to Stop Animation" + "</h3>" + "<br>");
  $("#instructions-div").append(instructions);
  instructions.hide(0);
  instructions.fadeIn(1000);
  
  // set GIPHY API url for ajax API call
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gifTopic + "&api_key=dc6zaTOxFJmzC";
  
  // GIPHY API Call
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(gifData) {

    // console log the object to make sure the response data is pulling in correctly
    console.log(gifData);

    // populate based upon starting and ending index with static image and rating, store animated gif URL as a data value to use later
    for (let i = startingIndex; i < endingIndex; i++) {
      var gifDiv = $("<div class='gif-div col-lg-3 col-sm-6 col-md-3 col-xs-12' style='margin-bottom:10px;padding:20px;'></div>");
      var gif = $("<img class='gif-still' width='100%' height='200px'></img>");
      gif.attr("src", gifData.data[i].images.fixed_width_still.url);
      gif.attr("data-altSrc", gifData.data[i].images.fixed_width.url);
      $("#gifs-view").append(gifDiv);
      gifDiv.append(gif);
      gifDiv.append("<p class='rating'>" + "Rated: " + gifData.data[i].rating + "</p>");
      gif.hide(0);
      gif.fadeIn(1000);
    }

    // button for previous
    var prevBtn = $("<button id='prev-button' class='col-sm-5 col-xs-12 col-md-5 col-lg-5 btn btn-success'><- Previous</button>")
    $("#gifs-view").append(prevBtn);
    prevBtn.hide(0);
    prevBtn.fadeIn(1000);

    // previous button functionality 
    $("#prev-button").on("click", function() {
      if (endingIndex > 5) {
        $("#gifs-view").empty();
        $("#instructions-div").empty();
        startingIndex -= 4;
        endingIndex -= 4;
        getGifData(gifTopic);
      }
    })
    // space between previous and next buttons
    var btnSpace = $("<div class='col-sm-2 col-xs-0 col-md-2 col-lg-2'></div>")
    $("#gifs-view").append(btnSpace);

    // button for next
    var nextBtn = $("<button id='next-button' class='col-sm-5 col-xs-12 col-md-5 col-lg-5 btn btn-success'>Next -></button>")
    $("#gifs-view").append(nextBtn);
    nextBtn.hide(0);
    nextBtn.fadeIn(1000);

    // next button functionality
    $("#next-button").on("click", function() {
      if (startingIndex < 21) {
        $("#gifs-view").empty();
        $("#instructions-div").empty();
        startingIndex += 4;
        endingIndex += 4;
        getGifData(gifTopic);
      }
    })

    // switch the src url to the previously called and stored animated gif URL, create a temp for reverse functionality (switches back to static when clicked again)
    $(".gif-still").on("click", function() {
      var temp = $(this).attr("src");
      $(this).attr("src", $(this).attr("data-altSrc"));
      $(this).attr("data-altSrc", temp);
    })
  })
};


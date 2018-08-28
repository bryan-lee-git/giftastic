
// GIFtastic - GIPHY API Gif Search / View / Download App

//-----------------------------------------------------------------------------------------------
// GLOBAL VARIABLES
//-----------------------------------------------------------------------------------------------

// initial array of gifs
var gifs = ["Debugging Code", "Coder", "Web Dev", "Punch Computer", "Coding Frustration", "Coding Meme", "Mind Blown", "Star Trek", "Picard", "Janeway", "Benjamin Sisko", "The Borg"];

// starting and ending indexes for iterating through GIPHY API Response Data
var startingIndex = 1;
var endingIndex = 5;

//-----------------------------------------------------------------------------------------------
// APP FUNCTIONS
//-----------------------------------------------------------------------------------------------

// function for displaying array data in buttons
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

// function for populating GIF stills on search
function getGifData(gifTopic) {
  
  // display intructions in instructions area
  
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
      gif.attr("src", gifData.data[i].images.original_still.url);
      gif.attr("data-altSrc", gifData.data[i].images.original.url);
      $("#gifs-view").fadeIn(500);
      $("#gifs-view").append(gifDiv);
      gifDiv.append(gif);
      gifDiv.append("<p class='rating'>" + "Rated: " + gifData.data[i].rating + "</p>");
      gif.hide(0);
      gif.fadeIn(1000);
    }

    // switch the src url to the previously called and stored animated gif URL, create a temp for reverse functionality (switches back to static when clicked again)
    $(".gif-still").on("mouseover", function() {
      // set temp variable to hold still img src
      var temp = $(this).attr("src");
      // change img src to alternate animated value stored during API call
      $(this).attr("src", $(this).attr("data-altSrc"));
      //  replace the alternate animated value with the stored static value to switch and stop animation on next click
      $(this).attr("data-altSrc", temp);
    })

    // on image double click, handle the same functionality for switching to animated, hide regular app view, generate and display theater view with back and download buttons
    $(".gif-still").dblclick(function() {

      // run same actions for single click
      var temp = $(this).attr("src");
      $(this).attr("src", $(this).attr("data-altSrc"));
      $(this).attr("data-altSrc", temp);

      // make sure we are working with the "this" we want to be working with"
      console.log(this);

      // fade main container out, generate and display theater container
      $("#container-main").fadeOut(500);
      var theaterContainer = $("<div class='container'></div>")
      var theaterView = $("<div id='theater' class='jumbotron'></div>")
      $("body").append(theaterContainer);
      theaterContainer.append(theaterView);
      theaterContainer.hide(0);
      theaterContainer.fadeIn(2000);

      // load in the clicked image at a larger size
      $(this).attr("height", "auto");
      theaterView.append(this)

      // include a back button to return to previous main container view
      var backBtn = $("<button id='back-button' class='col-sm-12 col-xs-12 col-md-12 col-lg-12 btn btn-success'>Back to Search View</button>");
      theaterContainer.append(backBtn);

      backBtn.on("click", function() { 
        theaterContainer.hide();
        $("#gifs-view").empty();
        getGifData(gifTopic);
        $("#container-main").fadeIn(1000);
      })

      // include a download button for the user to download the gif they are viewing in theater mode
      var downloadBtn = $("<button id='download-button' class='col-sm-12 col-xs-12 col-md-12 col-lg-12 btn btn-success'>Download from GIPHY</button></a>");
      downloadBtn.attr("href", $(this).attr("src"));
      downloadBtn.attr("download", $(this).attr("src"));
      theaterContainer.append(downloadBtn);

      downloadBtn.on("click", function(e) {
        e.preventDefault();
        window.location.href = downloadBtn.attr("href");
      })
    })
  })
}

//-----------------------------------------------------------------------------------------------
// RUN PROGRAM
//-----------------------------------------------------------------------------------------------

// once page is loaded, do this...
$(document).ready(function() {

  // app intro slideDown
  $(".jumbotron").hide();
  $("#gifs-view").hide();
  $(".jumbotron").slideDown(500);

  // calling the renderButtons function to display the initial list of gifs
  renderButtons();

})

//-----------------------------------------------------------------------------------------------
// CLICK FUNCTIONS
//-----------------------------------------------------------------------------------------------

// prevent default form submit button action
$("#gif-form").submit(function(e) {
  e.preventDefault();
})

// function to handle events where one topic button is clicked
$("#add-gif").on("click", function() {

  // assign user input value to a variable
  var gifData = $("#gif-input").val();

  // If nothing was input by the user before submit, alert an error
  if (gifData === "") {
    alert("Invalid Input. Try Again");
  } 

  // if there is data, add it to a button in the button area and store the value for later API use
  else {
    gifs.push(gifData);
    var newGifBtn = $("<button class='gif-button gif btn'>" + gifData + "</button>");
    $("#gifs-btns").append(newGifBtn);
    newGifBtn.attr("data-gifTopic", gifData);
    newGifBtn.hide(0);
    newGifBtn.fadeIn(500);
  }
})

// GIF topic button functionality
$(document).on("click", ".gif", function() {

  // reset starting and ending indexes for new topic
  startingIndex = 1;
  endingIndex = 5;

  // empty out the gif and instructions display
  $("#gifs-view").empty();

  // hide the footer so that it does not overlap content
  $(".footer").fadeOut(200);

  // create variable to hold the data value we will run through the API call function
  var gif = $(this).attr('data-gifTopic');

  // empty out topic display area
  $("#topic-div").empty();

  // add new topic to topic display area
  $("#topic-div").prepend("Selected Topic: " + gif);
  $("#topic-div").hide(0);
  $("#topic-div").fadeIn(1000);

  // create and display instructions
  $("#instructions-div").empty();
  var instructions = $("<h3 id='instructions'>" + "Mouseover: View or Stop Animation | Dbl Click: Theater View" + "</h3>" + "<br>");
  $("#instructions-div").append(instructions);
  instructions.hide(0);
  instructions.fadeIn(1000);

  // console log the object to make sure it is being assigned to the variable correctly
  console.log(gif);

  // run the GIF API Call function using the gif variable
  getGifData(gif);

  // fade the new gif data in
  $("#gifs-view").fadeIn(500);

  // previous and next buttons
  $("#buttons-view").empty();

  // button for previous
  var prevBtn = $("<button id='prev-button' class='col-sm-5 col-xs-12 col-md-5 col-lg-5 btn btn-success'><- Previous</button>")
  $("#buttons-view").append(prevBtn);
  prevBtn.hide(0);
  prevBtn.fadeIn(1000);

  // previous button functionality 
  $("#prev-button").on("click", function() {
    if (endingIndex > 5) {
      $("#gifs-view").empty();
      startingIndex -= 4;
      endingIndex -= 4;
      getGifData(gif);
    }
  })

  // space between previous and next buttons
  var btnSpace = $("<div class='col-sm-2 col-xs-0 col-md-2 col-lg-2'></div>")
  $("#buttons-view").append(btnSpace);

  // button for next
  var nextBtn = $("<button id='next-button' class='col-sm-5 col-xs-12 col-md-5 col-lg-5 btn btn-success'>Next -></button>")
  $("#buttons-view").append(nextBtn);
  nextBtn.hide(0);
  nextBtn.fadeIn(1000);

  // next button functionality
  $("#next-button").on("click", function() {
    if (startingIndex < 21) {
      $("#gifs-view").empty();
      startingIndex += 4;
      endingIndex += 4;
      getGifData(gif);
    }
  })
})



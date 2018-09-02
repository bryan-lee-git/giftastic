// GIFtastic - GIPHY API Gif Search / View / Download App

//-----------------------------------------------------------------------------------------------
// GLOBAL VARIABLES
//-----------------------------------------------------------------------------------------------

var gifs = ["Star Trek", "Picard", "TNG", "Janeway", "Voyager", "Benjamin Sisko", "DS-9", "The Borg"];
var startingIndex = 1;
var endingIndex = 5;
var favList = [];
var mostRecent = [];

//-----------------------------------------------------------------------------------------------
// APP FUNCTIONS
//-----------------------------------------------------------------------------------------------

// on page load, check if there is anything in storage, load and display stored w/ view favs btn
// if nothing in storage, set empty array
function loadFavs() {

  var favParse = JSON.parse(localStorage.getItem("favs"));
  console.log(favParse)

  if (favParse.length > 0) {
    favList = favParse;
  } else {
    favList = [];
  }

  if (favList.length != 0) {
    var favBtn = $("<button class='btn' id='fav-button'>View Favorites</button>")
    $("#gifs-btns").prepend(favBtn);
  }
}
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
    
  // set GIPHY API url for ajax API call
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gifTopic + "&api_key=dc6zaTOxFJmzC";
  
  // GIPHY API Call
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(gifData) {

    $("#gifs-view").fadeIn(100);

    // console log the object to make sure the response data is pulling in correctly
    console.log(gifData);

    // populate based upon starting and ending index with static image and rating, store animated gif URL as a data value to use later
    for (let i = startingIndex; i < endingIndex; i++) {
      var gifDiv = $("<div class='gif-div col-lg-3 col-sm-6 col-md-3 col-xs-12' style='margin-bottom:10px;padding:20px;'></div>");
      var gif = $("<img class='gif-still' width='100%' height='250px'></img>");
      gif.attr("src", gifData.data[i].images.original_still.url);
      gif.attr("data-altSrc", gifData.data[i].images.original.url);
      gif.attr("data-download", gifData.data[i].images.original.url);
      $("#gifs-view").append(gifDiv);
      gifDiv.append(gif);
      gifDiv.prepend("<p style='min-height:25px;' class='title'>" + gifData.data[i].title + "</p>");
      gifDiv.append("<p class='rating'>" + "Rated: " + gifData.data[i].rating + "</p>");
      gifDiv.hide(0);
      gifDiv.fadeIn(800);
    }

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

  //load in any saved data
  loadFavs();

})

//-----------------------------------------------------------------------------------------------
// CLICK FUNCTIONS
//-----------------------------------------------------------------------------------------------

// prevent default form submit button action
$("#gif-form").submit(function(e) {
  e.preventDefault();
})
// adds a gif topic button with the user's input into the button area
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
// GIF topic button - functionality to load in gifs for topic button clicked
$(document).on("click", ".gif", function() {

  mostRecent.push($(this).attr('data-gifTopic'));

  // reset starting and ending indexes for new topic to start on page 1 of data
  startingIndex = 1;
  endingIndex = 5;

  // empty out the gif and instructions display
  $("#gifs-view").empty();
  $("#title-view").empty();

  // hide the footer so that it does not overlap content
  $(".footer").fadeOut(200);

  // create variable to hold the data value we will run through the API call function
  var gif = $(this).attr('data-gifTopic');

  // empty out topic display area
  $("#topic-div").empty();

  // add new topic to topic display area
  $("#topic-div").append("Selected Topic: " + gif);
  $("#topic-div").hide(0);
  $("#topic-div").fadeIn(1000);

  // create and display instructions
  $("#instructions-div").empty();
  var instructions = $("<h3 id='instructions'><span style='color:red;'>Mouseover/Touch: View or Stop Animation </span> <span style='color:blue;'>| Click: Add to Favs </span> <span style='color:green;'>| Dbl Click: Theater View</span></h3><br>");
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
      $("#title-view").empty();
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
      $("#gifs-view").empty(500);
      $("#title-view").empty(500);
      startingIndex += 4;
      endingIndex += 4;
      getGifData(gif);
    }
  })
})
// switch the src url to the previously called and stored animated gif URL, create a temp for reverse functionality (switches back to static when clicked again)
$(document).on("mouseover", ".gif-still", function() {
  // set temp variable to hold still img src
  var temp = $(this).attr("src");
  // change img src to alternate animated value stored during API call
  $(this).attr("src", $(this).attr("data-altSrc"));
  // replace the alternate animated value with the stored static value to switch and stop animation on next click
  $(this).attr("data-altSrc", temp);
})
$(document).on("mouseleave", ".gif-still", function() {
  // set temp variable to hold still img src
  var temp = $(this).attr("src");
  // change img src to alternate animated value stored during API call
  $(this).attr("src", $(this).attr("data-altSrc"));
  // replace the alternate animated value with the stored static value to switch and stop animation on next click
  $(this).attr("data-altSrc", temp);
})
// functionality for handheld device touch recognition
$(document).on("touchstart", ".gif-still", function() {
  // set temp variable to hold still img src
  var temp = $(this).attr("src");
  // change img src to alternate animated value stored during API call
  $(this).attr("src", $(this).attr("data-altSrc"));
  // replace the alternate animated value with the stored static value to switch and stop animation on next click
  $(this).attr("data-altSrc", temp);
})
// on image double click, handle the same functionality for switching to animated, hide regular app view, generate and display theater view with back and download buttons
$(document).on("dblclick", ".gif-still", function() {

  // make sure we are working with the "this" we want to be working with"
  console.log(this);

  // fade main container out, generate and display theater container
  $("#container-main").fadeOut(200);
  var theaterContainer = $("<div class='container'></div>");
  var theaterView = $("<div id='theater' style='background-color:transparent; padding: none;' class='jumbotron'></div>");
  $("body").append(theaterContainer);
  theaterContainer.append(theaterView);
  theaterContainer.hide(0);
  theaterContainer.fadeIn(1000);

  // load in the clicked image at a larger size
  $(this).attr("height", "auto");
  $(this).attr("width", "80%");
  theaterView.append(this)

  // include a back button to return to previous main container view
  $("#back-button").remove();
  var backBtn = $("<button id='back-button' class='col-sm-12 col-xs-12 col-md-12 col-lg-12 btn btn-success'>Back to Search</button>");
  theaterContainer.append(backBtn);

  backBtn.on("click", function() { 
    theaterContainer.hide();
    $("#gifs-view").empty();
    getGifData(mostRecent[0]);
    $("#container-main").fadeIn(1000);
  })
})
// saving and displaying favorited GIFs    
$(document).on("click", ".gif-still", function() {

  // when gif is clicked, add it to local storage
  var storeUrl = $(this).attr("data-download");
  favList.push(storeUrl);
  localStorage.setItem("favs", JSON.stringify(favList));
  console.log(favList);

  if (favList.length > 0) {
    $("#fav-button").hide();
    var favBtn = $("<button class='btn' id='fav-button'>View Favorites</button>")
    $("#gifs-btns").prepend(favBtn);
  }
})
// view favorites button functionality for displaying favorites area and loading in any saved favorites data from local storage
$("body").on("click","#fav-button", function() {

  $(".footer").fadeOut(200);
  $("#container-main").fadeOut(300);
  var favsContainer = $("<div style='color:white;margin-top:30px;' class='container'><h5><span style='color:green'>SAVE GIF: Right click (or press and hold if on a mobile device).</span><br><br><span style='color:red;'>REMOVE GIF: Double click to remove single gif from favorites list.</span></h5></div>");
  var favsView = $("<div id='favs' style='margin-bottom:5px;background-color:transparent;' class='row jumbotron'></div>");
  $("body").append(favsContainer);
  favsContainer.append(favsView);
  
  // display all favorited gifs
  for (let i = 0; i < favList.length; i++) {
    var favDiv = $("<div class='gif-div col-lg-3 col-sm-6 col-md-3 col-xs-12' style='padding:10px;'></div>");
    var fav = $("<img src='" + favList[i] + "' class='gif-fav' width='100%' height='250px' style='margin-top:5px;margin-bottom:5px;'></img>");
    fav.attr("data-favNumber", i);
    favsView.append(favDiv);
    favDiv.append(fav);
  }  

  //  add back button
  var backBtn = $("<button id='back-button' class='col-sm-12 col-xs-12 col-md-12 col-lg-12 btn btn-success'>Back to Search</button>");
  favsContainer.append(backBtn);

  backBtn.on("click", function() { 
    favsContainer.hide();
    $("#container-main").fadeIn(1000);

    if (favList.length === 0) {
      $("#fav-button").remove();
    }
  })

  //  add clear favorites button
  var clearBtn = $("<button id='clear-button' class='col-sm-12 col-xs-12 col-md-12 col-lg-12 btn btn-success'>Clear All</button>");
  favsContainer.append(clearBtn);

  clearBtn.on("click", function() { 
    favsView.empty();
    favList = [];
    localStorage.setItem("favs", JSON.stringify(favList));
  })

  favsContainer.hide(0);
  favsContainer.fadeIn(2000);

})
// clear items from favorites list on double click
$("body").on("dblclick",".gif-div", function() {
  var favCount = $(this).attr("favNumber");
  favList.splice(favCount, 1);
  localStorage.setItem("favs", JSON.stringify(favList));
  $(this).hide(200);
  console.log(favList);
})

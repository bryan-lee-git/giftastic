// GIPHY API Gif Search Web

// Initial array of gifs
var gifs = ["JavaScript", "Debugging", "Coding", "Development", "Cant Get Code to Work", "Coder", "Console.log"];
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
  var gifData = $("#gif-input").val();
  if (gifData === "") {
    alert("Invalid Input. Try Again");
  } 
  else {
    gifs.push(gifData);
    var newGifBtn = $("<button class='gif-button gif btn'>" + gifData + "</button>");
    $("#gifs-btns").append(newGifBtn);
    newGifBtn.attr("data-gifTopic", gifData);
  }
})

// Calling the renderButtons function to display the initial list of gifs
renderButtons();

$(document).on("click", ".gif", function() {
  startingIndex = 1;
  endingIndex = 5;
  $("#gifs-view").empty();
  $("#instructions-div").empty();
  $(".footer").fadeOut(200);
  var gif = $(this).attr('data-gifTopic');
  console.log(gif);
  getGifData(gif);
  $("#gifs-view").fadeIn(400);
})

//  Function for populating GIF stills on search

function getGifData(gifTopic) {

  var instructions = $("<h3 id='instructions'>" + "Click to View the Animated Version / Reclick to Stop Animation" + "</h3>" + "<br>");
  $("#instructions-div").append(instructions);
  instructions.hide(0);
  instructions.fadeIn(1000);

  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gifTopic + "&api_key=dc6zaTOxFJmzC";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(gifData) {

    console.log(gifData);

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

    var prevBtn = $("<button id='prev-button' class='col-sm-5 col-xs-12 col-md-5 col-lg-5 btn btn-success'><--- Previous 4</button>")
    $("#gifs-view").append(prevBtn);
    prevBtn.hide(0);
    prevBtn.fadeIn(1000);

    $("#prev-button").on("click", function() {
      if (endingIndex > 5) {
        $("#gifs-view").empty();
        $("#instructions-div").empty();
        startingIndex -= 4;
        endingIndex -= 4;
        getGifData(gifTopic);
      }
    })

    var btnSpace = $("<div class='col-sm-2 col-xs-0 col-md-2 col-lg-2'></div>")
    $("#gifs-view").append(btnSpace);

    var nextBtn = $("<button id='next-button' class='col-sm-5 col-xs-12 col-md-5 col-lg-5 btn btn-success'>Next 4 ---></button>")
    $("#gifs-view").append(nextBtn);
    nextBtn.hide(0);
    nextBtn.fadeIn(1000);

    $("#next-button").on("click", function() {
      if (startingIndex < 21) {
        $("#gifs-view").empty();
        $("#instructions-div").empty();
        startingIndex += 4;
        endingIndex += 4;
        getGifData(gifTopic);
      }
    })

    $(".gif-still").on("click", function() {
      var temp = $(this).attr("src");
      $(this).attr("src", $(this).attr("data-altSrc"));
      $(this).attr("data-altSrc", temp);
    })
  })
};


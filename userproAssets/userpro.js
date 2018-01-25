  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAdkSaJem8XFuk6yjFaJbKHOJoNXkKhS3I",
    authDomain: "moodify-9f3d9.firebaseapp.com",
    databaseURL: "https://moodify-9f3d9.firebaseio.com",
    projectId: "moodify-9f3d9",
    storageBucket: "moodify-9f3d9.appspot.com",
    messagingSenderId: "1070794739398"
  };
  firebase.initializeApp(config);

    var database = firebase.database();

var artist="";
var url="";
var quotes=["If you have built castles in the air, your work need not be lost; that is where they should be. Now put foundations under them.","Doubt whom you will, but never yourself.","I was always looking outside myself for strength and confidence, but it comes from within. It is there all of the time.","I have not the shadow of a doubt that any man or woman can achieve what I have, if he or she will make the same effort, and have the same hope and faith.","We are all faced with a series of great opportunities - brilliantly disguised as insoluable problems.","Happiness resides not in possessions and not in gold; the feeling of happiness dwells in the soul.","The happiness of your life depends upon the quality of your thoughts; therefore guard accordingly.","The happiness of your life depends upon the quality of your thoughts; therefore guard accordingly.","Happiness is not achieved by the conscious pursuit of happiness; it is generally the by-product of other activities.","	The way to gain a good reputation, is to endeavor to be what you desire to appear.","The fact is, that to do anything in the world worth doing, we must not stand back shivering and thinking of the cold and danger, but jump in and scramble through as well as we can."];

// generate spotify player on mood click
$(".imageMood").on("click", function(){
	$("#spotify-div").empty();

  // generate new quote
	newQuote();

  // get mood from image attribute
	var selectMood = $(this).attr("data-name");
    console.log(selectMood);
    var accessToken = "BQBCBxgR89BRfgBH1RjqIvkNJWRwuEREr9HClrYA8Fzd8z1J-hRUIl_knsECgMHMJwOicJjNIcrxvBQPqJhwcfE20R3V_XVTFaW7heXRpYmgab6eS5NVIZCN1fkP22PBvVf21363J3dJQfZB7FmrbdlNqPKM6kDQXEY";
    var typeOf = "track,artist";
    
    // IoT API.
    if(selectMood==="happy"){
        var url = "http://172.20.10.12:500/TWO"; 
      };
    if(selectMood==="sad"){ 
        var url = "http://172.20.10.12:500/THREE";   
       };
    if(selectMood==="focus"){ 
        var url = "http://172.20.10.12:500/FOUR";   
      };
      if(selectMood==="excercise"){ 
        var url = "http://172.20.10.12:500/FIVE";   
      };
      
      
    $.ajax({
      url: url ,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      type: "GET", /* or type:"GET" or type:"PUT" */
      dataType: "json",
      data: {
      },
      success: function (result) {
          console.log(result);    
      },
      error: function () {
          console.log("error");
      }
  });

    // Access spotify API
    $.ajax({
    
     url: 	'https://api.spotify.com/v1/search?q='+selectMood+'&type='+typeOf,
  
  
     headers: {
         'Authorization': 'Bearer ' + accessToken ,
        
      },
     success: function(response) {
            var array=response.tracks.items.length;

            // get target artist from array
            targetNumber=Math.floor(Math.random()*(array-1));
             console.log(response);
             console.log(response.tracks.items.length);
         
              artist= response.tracks.items[targetNumber].album.artists[0].name;
              console.log(artist);     
              console.log(response.tracks.items[targetNumber].album.uri);
              var uri = response.tracks.items[targetNumber].album.uri;
              var spotifyHttp = "https://open.spotify.com/embed?uri=" + uri ;
          console.log(spotifyHttp); 

          // generate player
          var playlist = $("<iframe>");
          playlist.attr("src",spotifyHttp);
          playlist.attr("width", "300");
          playlist.attr("heigth", "380");
          playlist.attr("frameborder","0");
          playlist.attr("theme","white");
          playlist.attr("view","list");
          playlist.attr("allowtransparency", "true");
          $("#spotify-div").append(playlist);

          showEvents();
       }        
      });
})

// quote generator
function newQuote(){
	var array=quotes.length;
    targetNumber=Math.floor(Math.random()*(array-1));
    $(".card-footer").html(quotes[targetNumber]);
}

// event list generator
function showEvents(){
  $("#eventImage").hide();
  url="https://app.ticketmaster.com//discovery/v2/events.json?keyword="+artist+"&apikey=SGVJgpiN25atRhKM1njYjoGUB8N5eCtR";
  $("#searchInput").val("");
  $("#List").html("");
  $.ajax({
    url: url,
    method: "GET"
     })
  .done(function(response) {
    console.log(response);
    var elements=response.page.totalElements;
    console.log(events);

    // if artist has no upcoming events
    if (elements<=0){
      $("#List").append("<tr><td>"+"No Events"+"</td></tr>");
    }

    else{
      var events=response._embedded.events;
      var eventName=events[0].name;
      var date=events[0].dates.start.localDate;
      var country=events[0]._embedded.venues[0].country.name;
      var city=events[0]._embedded.venues[0].city.name;
      var venue=events[0]._embedded.venues[0].name;
    
      if (events.length<5){
        for (var i=0; i<events.length; i++){
          $("#List").append("<tr><td>" + events[i].name + "</td><td>" + events[i].dates.start.localDate + "</td><td>" +
            events[i]._embedded.venues[0].country.name + "</td><td>" + events[i]._embedded.venues[0].city.name + "</td><td>"+ events[i]._embedded.venues[0].name+"</td></tr>");
        }
      };

      if (events.length>=5){
         for (var i=0; i<5; i++){
          $("#List").append("<tr><td>" + events[i].name + "</td><td>" + events[i].dates.start.localDate + "</td><td>" +
            events[i]._embedded.venues[0].country.name +  "</td><td>" + events[i]._embedded.venues[0].city.name + "</td><td>"+ events[i]._embedded.venues[0].name+"</td></tr>");
        }
      };
    }
  });
}

// if user is logged in, console log the user. If not signed in send user to landing page
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
   
  } else {
    console.log("nobody signed in");
    window.location.href="index.html";
  }
});

// sign out
$("#signOut").on("click", function(){
  firebase.auth().signOut();
  window.location.href="index.html";
})
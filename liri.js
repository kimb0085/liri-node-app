//Liri takes the following arguments
// * my-tweets
// * spotify-this-song
// * movie-this
// * do-what-it-says


//Use dotenv to overwrite the twitter and spotify keys in keys.js 
	//*this did not work, so I added the keys to key.js and added keys.js to my gitignore file
require("dotenv").config(process.env);


//create global variables (especially for interacting with node modules)

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');

var arg = process.argv;
var choice = arg[2];

//connect with spotify via keys.js file
var spotify = new Spotify(keys.spotify);

//capture the tweets I've tweeted
var showTweets = function() {
	//connect with twitter 
	var client = new Twitter(keys.twitter);
	var params = {screen_name: 'winstonyruby'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    console.log('All the tweets are: ');
		for (var i = 0; i < tweets.length; i++) {
			console.log('created on: ' + tweets[i].created_at);
			console.log('tweet itself: ' + tweets[i].text);
			console.log('..................');
		}
	  }
	});
}

//Creates a function for finding artist name from spotify
var artistName = function(artist) {
  return artist.name;
};

//get musical from spotify
var showSong = function(songName) {
	console.log("got inside showSong");
		
	//if no song is requested, return The Sign by Ace of Base
	if (songName === undefined) {
		songName = 'The Sign Ace of Base';
	};

	//search spotify for songs
	spotify.search({ type: 'track', query: songName}, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    } 

		var songs = data.tracks.items;
		
		for (var x = 0; x < songs.length; x++) {
			console.log(x);
			console.log('artist(s): ' + songs[x].artist.map(artistName));
			console.log('song name: ' + songs[x].name);
			console.log('song preview ' + songs[x].preview_url);
			console.log('album ' + songs[x].album.name);
			console.log('..........................................');
		}
	});
}


//interact with OMDB to find movies
var showMovie = function(movieName) {

	// var omdbCall = "https://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&r=json&apikey=trilogy";

	var omdbCall = "https://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

	// "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json&apikey=trilogy";

	request(omdbCall, function(error, response, body) {
			//return requested movie information and if no movie name is given, return Mr. Mobody
		 if (!error && response.statusCode == 200) {
		 	var jsonData = JSON.parse(body);
	
			console.log('movie title: ' + jsonData.Title);
			console.log('release year: ' + jsonData.Year);
			console.log('imdb rating: ' + jsonData.imdbRating);
			console.log('rotten tomatoes rating: ' + jsonData.tomatoRating);
			console.log('coutry of origin: ' + jsonData.Country);
			console.log('movie language: ' + jsonData.Language);
			console.log('movie plot: ' + jsonData.Plot);
			console.log('who starred: ' + jsonData.Actors);
			console.log('..........................................');
		} else if (movieName === undefined) {
			movieName = 'Mr. Nobody';
			console.log('Never seen Mr. Nobody? You Should! See it on Netflix');
		}		
		
	});

}


//return information from random.txt file to the terminal
var doIt = function() {
	
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err) throw err;

		console.log(data);
		
	});
	
}


//return the right information, based on the user's chioce
	if (choice === 'my-tweets') {
		showTweets();
	} else if (choice === 'spotify-this-song') {
		showSong();
	} else if (choice === 'movie-this') {
		showMovie();
	} else if (choice === 'do-what-it-says') {
		doIt();
	}


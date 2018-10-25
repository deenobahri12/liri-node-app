require("dotenv").config();
var Spotify = require("node-spotify-api");
const keys = require("./key.js");
var inquirer = require("inquirer");
var request = require("request");

// Spotify API Keys
var spotify = new Spotify(keys.spotify);

//------------------------

function playSong() {
    inquirer.prompt([{
        type: "input",
        message: "look up a song",
        name: "query"
    }]).then(function (inquirerResponse) {
        spotify.search({
            type: 'track',
            query: inquirerResponse.query,
            limit: 1
        }, function (err, data) {
            if (!err) {
                var songObj = data.tracks.items[0];
                var artistName = songObj.album.artists[0].name;
                console.log(`
            Artist: ${artistName}
            Song title: ${inquirerResponse.query}
            Album Name: ${songObj.album.name}
            Preview URL: ${songObj.preview_url}`);
                liriInit();
            } else {
                console.log(`Error: ${err}`);
            }
        })
    })
};


//OMDB API request
function movieQuery() {
    inquirer.prompt([{
        type: "input",
        message: "What movie do you wanna search?",
        name: "query"
    }]).then(function (inquirerResponse) {
        request(`http://www.omdbapi.com/?t=${inquirerResponse.query}&apikey=trilogy`, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                var movieINFO = JSON.parse(body);
                console.log(`
                Movie Title: ${movieINFO.Title}
                Year Released: ${movieINFO.Year}
                IMDB Rating: ${movieINFO.Ratings[0].Value}
                Rotten Tomtoes Rating: ${movieINFO.Ratings[1].Value}
                Produced in: ${movieINFO.Country}
                Language(s): ${movieINFO.Language}
                Plot: ${movieINFO.Plot}
                Actors: ${movieINFO.Actors}
                 `);
                 liriInit();
            }
        })
    })
};
 //BandsInTown API request
function bandQuery() {
    inquirer.prompt([{
        type: "input",
        message: "What Artist/Band would you like to look up?",
        name: "query"
    }]).then(function (inquirerResponse) {
        request(`https://rest.bandsintown.com/artists/${inquirerResponse.query}/events?app_id=codingbootcamp`, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                let bandINFO = JSON.parse(body);
                console.log(`
                Name of venue:   ${bandINFO[0].venue.name}
                venue location:  ${bandINFO[0].venue.city}, ${bandINFO[0].venue.country}
                See Tour Dates:  ${bandINFO[0].datetime}
                `);
                 liriInit();
            }
        })
    })
};

var fs = require("fs");
function doThis() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
    })
};
function liriInit() {
    inquirer.prompt([{
            type: "list",
            message: "What do you wanna look up?",
            choices: ["Spotify-this-song", "Movie-this", "Concert-this", "Do-what-it-says"],
            name: "userCommand"
        },
        {
            type: "confirm",
            message: "Are you sure?",
            name: "confirm",
            default: true
        }
    ]).then(function (inquirerResponse) {
        if (inquirerResponse.confirm) {
            switch (inquirerResponse.userCommand) {
                case "Spotify-this-song":
                    playSong();
                    break;
                case "Movie-this":
                    movieQuery();
                    break;
                    case "Concert-this":
                    bandQuery();
                    break;
                case "Do-what-it-says":
                    doThis()
                    break;
            }
        }
    })
}
liriInit();

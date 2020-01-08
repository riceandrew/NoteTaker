// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
const uuidv1 = require('uuid/v1')

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
})
app.get("/api/notes", function (req, res) {
  fs.readFile("journal.json", "utf8", function (error, data) {

    if (error) {
      return console.log(error);
    }

    console.log(data);
    //converting string into an array 
    var db = JSON.parse(data);
  res.json(db)
  })
})


app.post("/api/notes", function (req, res) {
  //Information coming from the front end (hit save)
  console.log("obj or arr", req.body)
  var newNote = req.body;
  
  // [{"title":"Test Title","text":"Test text", "id": 0}]



  //reads json as a string
  fs.readFile("journal.json", "utf8", function (error, data) {

    if (error) {
      return console.log(error);
    }

    console.log(data);
    //converting string into an array 
    var arr = JSON.parse(data);
    

    //add id number to the newNote
    var noteId = uuidv1()
    newNote["id"] = noteId;
    

    //adds new saved note to array
    arr.push(newNote)

    //converting array back into string
    var updatedJournal = JSON.stringify(arr);
    console.log(updatedJournal)

    fs.writeFile ('journal.json', updatedJournal, function (err) {
      if (err) {
        return console.log (err);
      }
    
      console.log ('Success!');

      res.json({});
    });

  });

})

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

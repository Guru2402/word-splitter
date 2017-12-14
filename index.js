const sqlite3 = require("sqlite3").verbose();
const graphemeSplitter = require("./node_modules/grapheme-splitter/index.js");

var split = new graphemeSplitter();

// open database in memory
let db = new sqlite3.Database("wordsearch.db", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-File SQlite database.");
});

let sql = `SELECT word word
           FROM fr`;

// Row by row
db.each(sql, [], (err, row) => {
  if (err) {
    return console.error(err.message);
  }
  //console.log(row.word);
  var str = row.word.toString();
  var test = split.splitGraphemes(str).toString(); // splitted the first row word
  //console.log(test);
  // update the result
  var q = split.countGraphemes(str);
  if (q > 2) {
    db.run(`UPDATE fr SET word = ? WHERE word = ? `, [test, str], function(
      err
    ) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
    });
  } else {
    db.run(`DELETE FROM fr WHERE word = ? `, [str], (err, success) => {
      if (err) {
        console.log(err);
      }
      console.log("success");
    });
  }
});

// close the database connection
db.close(err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Close the database connection.");
});

//https://github.com/leventeScheck88/node-js-getting-started/blob/master/index.js
var parser = require('rss-parser');
var express = require('express');
var app = express();
var pg = require('pg');



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/hello', function(request, response) {
  response.end(JSON.stringify(process.env));
});

app.get('/rss', function(request, response) {
  //parser.parseURL('https://www.reddit.com/.rss', function(err, parsed) {
    var options= {
      customFields: {
        feed: ['image', 'image'],
        item: ['enclosure','enclosure'],
      }
    }
  parser.parseURL('http://rss.stirileprotv.ro/', function(err, parsed) {
    
    console.log(parsed.feed.title);
    parsed.feed.entries.forEach(function(entry) {
      console.log(entry.title + ':' + entry.link);
    })
    // response.end(JSON.stringify(parsed.feed.entries));
    response.send(parsed.feed.entries);
  })
  
});



app.get('/db', function (request, response) {
  //var pool = new pg.Pool();
  //https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database
  // psql -h localhost
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });

});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

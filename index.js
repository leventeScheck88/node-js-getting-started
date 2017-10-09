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



app.get('/db', function (request, response) {
  var pool = new pg.Pool();
  //var url = process.env.DATABASE_URL || 'postgres://localhost';
  var url = 'postgres://localhost';
  pool.connect(url, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       //{ response.render('pages/db', {results: result.rows} ); }
       { response.end(JSON.stringify(result.rows) ); }
    });
  });
  pool.end()
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

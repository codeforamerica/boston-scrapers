var couch = process.env['DATACOUCH_ROOT'];

var request = require('request').defaults({json: true}),
    csv = require('csv'),
    _ = require('underscore'),
    url = require('url'),
    crypto = require('crypto'),
    http = require('http');

function fetchCSV(url, callback) {
  var headers, rows = [], chunkSize = 500;
  csv()
  .fromStream(request(url))
  .on('data', function(data, index) {
    if (!headers) {
      headers = data;
      return;
    }
    var row = {}
    _(_.zip(headers, data)).each(function(tuple) {
      row[_.first(tuple)] = _.last(tuple)
    })
    row._id = crypto.createHash('md5').update(JSON.stringify(row)).digest("hex")
    rows.push(row)
    if (rows.length === chunkSize) {
      callback(rows)
      rows = []
    }
  })
  .on('end', function(count) {
    callback(rows)
  })
  .on('error', function(e) {
    console.log('csv error', e)
  })
}

request(couch + '/boston-files/_design/files/_rewrite/csv', function(e,r,b) {
  _.each(b.rows, function(file) {
    fetchCSV(file.doc.url, function(rows) {
      request({url: couch + '/' + file.doc.destination + '/_bulk_docs', method: "POST", body: {docs: rows}}
        , function(e,r,b) {
          if (e) console.log('_bulk_docs error', e)
          console.log(file.doc.destination, b)
        })
    })
  })
})


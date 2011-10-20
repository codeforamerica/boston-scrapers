// Simple geocouch spatial couchapp for neighborhood lookups, used in http://datacouch.com/edit/#/dc793ad17aa3a3114c2f323726b227687d

var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = { _id:'_design/gps'};

ddoc.spatial = {
  neighborhood: function(doc) {
    if (doc.geometry && doc.name) emit(doc.geometry, doc.name);
  }
}

module.exports = ddoc;
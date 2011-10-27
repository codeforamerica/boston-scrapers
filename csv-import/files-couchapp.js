// Simple couchapp for retrieving a list of files that should be downloaded daily from the City of Boston's servers

var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = { _id:'_design/files'
  , rewrites : [
    {from:"/:type", to:"_view/type", query:{endkey:":type", startkey:":type", include_docs:"true"}}
  ]
};

ddoc.views = {
  type: {
    map: function(doc) {
      if (doc.type) emit(doc.type)
    }
  }
}

module.exports = ddoc;
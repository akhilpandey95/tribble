var r = require('rethinkdb')
var assert = require('assert')

function call(callback) {
        r.connect({
                host : 'localhost',
                port : 28015
        }, function(err, conn) {
                assert.ok(err == null, err);
                callback(err,conn);
        });
}

var conn = 
r.connect({
        host : 'localhost',
        port : 28015,
        authkey : ''
}, function(err, conn) {
        if(err) throw err;
        console.log("Connected to the rethinkdb Server");
});

/* Table schema
 * (date, by, title, content)
 * primary key : date
 */

call(function(err, conn) {
        if(err) throw err;

        r.dbCreate('ghost').run(conn, function(err, res) {
                if(err) throw err;
                console.log("Database created");
        });

        r.db('ghost').tableCreate('favorites', {primaryKey: 'title'}).run(conn, function(err, res) {
                if(err) throw err;
                console.log("Table Successfully Created");
        });
        
        r.table("favorites", {useOutdated: true}).run(conn, function(err, res) {
                if(err) throw err;
                console.log("Potentially out of date data in exchange to faster reads");
        });

        r.table("favorites").pluck("title", "by").run(conn, function(err, res) {
                if(err) throw err;
                console.log(res);
        });

});


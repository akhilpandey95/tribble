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

function connection(callback) {
        if(useConnpooling) {
                console.log("[LOG_INFO] Initiating a pooled connection");
                connectionPool.acquire(function(err, conn) {
                        if(err) {
                                callback(err);
                        }
                        else {
                                console.log("[LOG_INFO] Connection Pooled %s", conn._id);
                        }
                });
        }
        else {
                r.connect({
                        host : db.host,
                        port : db.port
                }, function(err, conn) {
                        console.log("[ERR] Couldnot connect %s on %s port", db['host'], db['port']);
                        callback(err);
                }
                else {
                        conn.use(db.db);
                        console.log("[DB] Connection created");
                        callback(null, conn);
                }
                });
}

function free(conn) {
        console.log("[LOG-INFO]: Releasing connection: %s", conn._id);
        if(useConnPooling) {
                connectionPool.release(conn);
        }
        else {
                conn.close();
        }
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
/*
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
*/

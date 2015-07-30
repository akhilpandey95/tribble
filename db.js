var r = require('rethinkdb'),
    db = require('./config').dbconfig,
    assert = require('assert');

var conn =
r.connect({
    host : 'localhost',
    port : 28015,
    authkey : ''
}, function(err, conn) {
    if(err) throw err;
    console.log("Connected to the rethinkdb Server");

});

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
            if (err) {
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

if(typeof db.pool === 'object') {
    var g = require('generic-pool');
    pool = g.Pool({
        name : 'rethinkdb',
        min : db.pool.min || 5,
        max : db.pool.max || 100,
        log : db.pool.log || true,
        idleTimeoutMillis : db.pool.idleTimeoutMillis || 60000,
        reapIntervalMillis : db.pool.reapIntervalMillis || 30000,

        create : function(callback) {
            r.connect({
                host : db.host,
                port : db.port
            }, function(err, conn) {
                if(err) {
                    var msg = "Connection failed";
                    console.log("[ERR] Couldnot make a rethinkdb conneciton.");
                    callback(new Error(msg));
                }
                else {
                    var connid = Math.floor(Math.random()*10000);
                    conn.use(db.db);
                    console.log("[INFO] Connected to the database %s", db.db);
                    callback(null, conn);
                }
            });
        },
        destroy : function(conn) {
            console.log("[INFO] Connection %s has been closed", conn_id);
            conn.close();
        }
    })
}

exports.getdata = function(callback) {
    connection(function(err, conn) {
        if(err) {
            return callback(er);
        }

        r.table('tribble_links').run(conn, function(err, res) {
            if(err) {
                free(conn);
                callback(err);
            }

            res.toArray(function(err, data) {
                if(err) {
                    callback(err);
                }
                else {
                    callback(null, data);
                }
                free(conn);
            });
        });
    });
}

/* Table schema
 * (date, by, title, content)
 * primary key : date
 */

 exports.push = function(options, callback) {
    connection(function(err, conn) {
        if(err) {
            console.log("[ERR] Connection error %s:%s", err.name, err.message);
            callback(null);
        }
        r.table('maindata').insert([
            {date : options.date, source : options.site, content : options.content },
            {conflict : "replace"}
            ]).run(conn, function(err, res) {
                if(err) {
                    console.log("[ERR] Error in pushing content");
                    callback(err);
                }
                else {
                    console.log("[INFO] Content inserted");
                    console.log(res);
                    release(conn);
                }
            })
        })
}

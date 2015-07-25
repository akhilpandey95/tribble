modules.exports.dbconfig = {
        host : process.env.RDB_HOST || 'localhost',
        port : process.env.RDB_PORT || 28015,
        db : process.env.RDB_DB || 'tribble',
        pool : {
                min : 5,
                max : 100,
                log : true,
                idleTimeoutMillis : 60000,
                reapIntervalMillis : 30000,
        }
}

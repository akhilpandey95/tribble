/* Links that are essential :
 * 1. For prev page = http://www.engadget.com/page/n-1/
 * 2. For curr page = http://www.engadget.com/
 * 3. Example of the url : http://www.engadget.com/2015/06/04/apple-watch-reader-review-roundup/
 */
var http = require("http"),
    e = require("express"),
    c = require("cheerio"),
    fs = require("fs"),
    req = require("request");

module.exports.router = function() {
    var port = process.env.PORT || 8100,
        app = e(),
        api = e(),
        appr = e.Router(),
        apir = e.Router();

    app.set('title', "Tribble | The UI");
    api.set('title', "Tribble | The API");
    app.use(e.static('assets'));

    // The APP router
    appr.get('/', function(req, res) {
        var data = fs.readFileSync("index.html", "UTF-8");
        res.send(data.toString());
    });

    appr.get('/:somevalue', function(req, res) {
        var data = req.params.somevalue;
        res.send("Sorry cannot GET/ " + data + " on this page");
    });

    appr.post('/:somevalue', function(req, res) {
        var data = req.params.somevalue;
        res.send("Sorry cannot make a POST/ " + data + " to this page");
    });

    // The API router
    apir.get('/', function(req, res) {
        res.send("The API powering tribble");
    });

    apir.get('/post/:value', function(req, res) {
        var data = req.params.value;
        res.json({
            request : 'you have requested for ' + data,
            site    : {
                engadget : {
                    headline : 'the headline',
                    detail   : 'more info'
                },
                reddit   : {
                    headline : 'the headline',
                    detail   : 'more info'
                },
                gizmodo  : {
                    headline : 'the headline',
                    detail   : 'more info'
                }
            }
        });
    });

    app.use('/', appr);
    app.use('/api', apir);

    http.createServer(app).listen(port, function() {
       console.log("Serving at http://localhost:", port); 
    });
}

function getreddit() {
    var store = "";
    req('http://www.reddit.com/r/technology', function(err, res, html) {
        if(!err && res.statusCode == 200) {
            var l = c.load(html);

            // Info from Reddit (r/technology)
            l('div.entry').each(function(i, element) {
                var content = l(this).children().children().next('.title');
                var data = content.text();
                store += data;
            });
        }
    });
    return store;
}

function getgizmodo() {
    var store = "";
    req('http://www.gizmodo.in/gadgets', function(err,res, html) {
        if(!err && res.statusCode == 200) {
            var l = c.load(html);

            // Headlines from the Gadgets page of Gizmodo
            l('article.article').each(function (i, element) {
                var content = l(this).children().children().children('h2');
                var data = content.text();
                store += data;
            });
        }
    });
    return store;
}

function getengadget() {
    var store = "";
	req('http://www.engadget.com/', function(err, res, html) {
		if(!err && res.statusCode == 200) {
			var l = c.load(html);

            // Gives all the headlines together
            l('header.post-header').each(function(i, element) {
            	var content = l(this).children().children().children('.h2');
            	var data = content.text();
            	console.log(data);
            	store += data;
               });
            /*
            // Gives the top 5 current posts on the page
            l('div').attr('id','carousel').each(function(i, element) {
                    var content = l(this).children().children('.always');
                    console.log(content.text());
            });

            // Gives the top 2 current posts on the page
            l('li.top2').each(function(i, element) {
                    var content = l(this);
                    console.log(content.text());
           });

            // Gives the last current post on the page
            l('li.last').each(function(i, element) {
                    var content = l(this);
                    console.log(content.text());
                });*/
		}
	});
    return store;
}

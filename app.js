/* Links that are essential : 
 * 1. For prev page = http://www.engadget.com/page/n-1/ 
 * 2. For curr page = http://www.engadget.com/
 * 3. Example of the url : http://www.engadget.com/2015/06/04/apple-watch-reader-review-roundup/
 */
var e = require('express')
var c = require('cheerio')
var fs = require('fs')
var req = require('request')
var post = require('request')
var store = new Array();
var app = e();
var router = e.Router();
var port = process.env.PORT || 8100;

app.use(e.static('assets'));

console.log("Express Serving is starting")
console.log("Starting Scraping")

router.get('/', function(req, res) {
        var data = fs.readFileSync('index.html', 'utf8');
        res.send(data.toString());
});

app.use('/', router);
app.listen(port, function() {
        console.log("Listening on port " + port);
});

req('http://www.engadget.com/', function(err, res, html) {
                if(!err && res.statusCode == 200) {
                        var l = c.load(html);
                        
                        // Gives all the headlines together
                        l('header.post-header').each(function(i, element) {
                                var content = l(this).children().children().children('.h2');
                                var data = content.text();
                               // console.log(data);
                                store.push(data);
                                console.log(store);
                        });

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
                       });
                }
                });

post('http://localhost:8100/', function(err, res, html) {
        if(!err && res.statusCode == 200) {
                var p = c.load(html);
                p('h3.panel-title').each(function(i, element) {
                        var content = p(this);
                        console.log(content.text());
                });
        }
});



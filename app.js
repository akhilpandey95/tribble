/* Links that are essential : 
 * 1. For prev page = http://www.engadget.com/page/n-1/ 
 * 2. For curr page = http://www.engadget.com/
 * 3. Example of the url : http://www.engadget.com/2015/06/04/apple-watch-reader-review-roundup/
 */

var c = require('cheerio')
var fs = require('fs')
var req = require('request')

console.log("Starting Scraping")

req('http://www.engadget.com/', function(err, res, html) {
                if(!err && res.statusCode == 200) {
                        var l = c.load(html);
                        
                        // Gives all the headlines together
                        l('header.post-header').each(function(i, element) {
                                var content = l(this).children().children().children('.h2');
                                console.log(content.text());
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

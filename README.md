##tribble
This is a scraper that pulls information from the site and then loads it into a page making the user to view all the Posts without redirecting to the website. 

###Setup Instructions
- Install nodejs,npm

```
sudo apt-get install nodejs
sudo apt-get install npm

``` 

- Install RethinkDB

```
source /etc/lsb-release && echo "deb http://download.rethinkdb.com/apt $DISTRIB_CODENAME main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
wget -qO- http://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add -
sudo apt-get update
sudo apt-get install rethinkdb
```

###Install dependencies

```
npm install
```

###Things to Remember

> Since this parses information by DOM manipulations we might have the chancesof broken links as well as inability to parse/scrape the information. But if such a situation arises the repo will be updated to suit the modification of the new site.

#####Support:

- Engadget (supported)
- Ycombinator News (tested/minor-changed)
- CruchGear (testing)
- Gizmodo (testing)
- Wired (not tested)

###Contributions

I would love to have someone on the board contributing to the project.If any issues are open please look at the and if not open an issue and submit a PR.

###Licence

[The MIT License](https://github.com/AkhilHector/tribble/blob/master/LICENSE)

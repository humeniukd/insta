# Out of Office Activities

An app to help EPAM employees meet after work.

# Technical

## Key technologies used

* Node 6.x with ES6 + MongoDB latest version (back end).
* Angular 1.5 with ES6 + Babel (front end).
* Protractor, Mocha with Chai and Sinon (testing, TDD).
* Webpack (module bundler) + Gulp (task automation).
* LESS (CSS preprocessor).
* EPAM UUI (CSS framework, for general layout, based on Bootstrap) [more info](https://uui.epam.com/).
* OoOA project is based on [NG6-starter](https://github.com/AngularClass/NG6-starter).

## Tools

* Knowledge Base with a general outline of the project, [link](https://kb.epam.com/display/~Marcin_Zolkiewski/Out+of+Office+Activities) to OoOA KB.
* Slack (message board), [link](https://outofofficeactivities.slack.com/messages/general/) to our messaging app (check other channels).
* Git ([gitflow workflow ](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) is used), [link](https://git.epam.com/Marcin_Zolkiewski/out-of-office-activities) to our repo.
* JIRA, [link](https://jira.epam.com/jira/secure/RapidBoard.jspa?rapidView=46796&view=detail) to our issue tracker.

## Git naming convention

### Branches

**_{{ JIRA-ticket-number }}_**-**_{{ short-summary }}_**

E.g. `222-event-filtering`

### Commits

**_{{ [JIRA-ticket-number] }}_** **_{{ client/server/common }}_** | **_{{ component-name }}_**: **_{{ description-of-change }}_**

E.g. `[222] client | Event list: added column labels`

## MongoDB
[Install on Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) (configure a Windows Service for MongoDB can be found [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#configure-a-windows-service-for-mongodb-community-edition))  
[Install on OS X](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)  
[Install on Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

GUI clients for MongoDB ([Robomongo](https://robomongo.org/), [MongoChef](http://3t.io/mongochef/), [MongoVUE](http://www.mongovue.com/)).  

Database schemas will be created automatically.

## Installation

Clone the repository and run `npm install`.

## Continuous Integration & Deployment

The CI server is set up [here](https://evhubudsd25e8.budapest.epam.com:8085/).

The application is staged [here](http://evhubudsd25e8.budapest.epam.com:8443/) (develop branch).

## Tasks

Run `gulp help` to see available tasks.

Remember to take a look at the `scripts` section in `package.json` - if there are some wrappers for gulp tasks defined, you should use those instead of invoking gulp directly. These are mostly tasks that expect the `process.env.NODE_ENV` variable to be properly set.

## Run

Run `npm run serve`

* app <http://localhost:9443/>
* swagger <http://localhost:9443/swagger>, <http://localhost:9443/api-docs.json>

## Test
* Unit tests for client: `npm run test-unit`
* Unit tests for backend: `npm run test-backend`
* End to end: `npm run test-e2e`
* End to end without build: `test-e2e-nobuild`

NOTE: use npm NOT gulp directly

## Linters

Run `gulp lint` to check the code (JS, LESS, HTML). You can also run each check separately (refer to `gulp help` for task names). JS linter will attempt to automatically fix problems with code.

## Editor configuration

Please use the supplied `.editorconfig` file to configure your editors accordingly.

## MongoDB operations with gulp

Quick instruction how to dump and restore sample data for out of office activities applicaction.
For more information run: `gulp mongo-db-help`

## GENERAL
* "mongobackup" npm package required (npm install before start)
* Backup data should be created by mongodump command or by "gulp mongodump" task
* It has been tested with mongo 3.3
* For some reasons on Windows 10 I have to install mongo 64 bit with openssl libraries included
[Mongo DB with OpenSLL included](http://downloads.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-v3.0-latest-signed.msi?_ga=1.89001884.644804349.1472030562)
* out-of-office-activities-dev directory has been added to .gitignore to not overload repo

## IF you wanna restore sample data
* if you have zip and db is not yet in repo, paste zip content into PROJECT_DIRECTORY/db/
* if sample datas are already in repo and you fetch them by git pull go to step 3.
* run: `gulp populate-demo-data` in project directory

## IF you wanna dump sample data
* run: `gulp mongo-dump` in project directory
* run: `gulp categories-imgs-dump` in project directory

# Telegram/Discord Bridge

This bridge can get a message from telegram and then transforms and then push it to discord

## Working Flow
When the API is called

* Add a new message entry in the Postgres DB
* Transform the data as per the discord webhook requirements
* Add links to content words if they have link data in the `entities` array.
* Populate relevant data if it is a reply to another message 
* Push to discord webhook


### Running local

#### 1. Copy the sample ENV file
`cp sample.env .env`

The following has to be set:
* `PORT` - Default is 3000
* `DATABASE_URL` - Postgres Connection URL
* `DISCORD_WEBHOOK_URL` - Webhook URL from discord

#### 2. Install the dependency
`npm install`

#### 3. Start the service
`node start.js`

Connect telegram webhook to `http://localhost:3000/webhook`.


### Running Heroku
#### 1. Set ENV
Need to define the following environmental variables:
* `DATABASE_URL` - Postgres Connection URL
* `DISCORD_WEBHOOK_URL` - Webhook URL from discord

#### 2. Push to Heroku
`git push heroku master`

Connect telegram webhook to `http://example/webhook`.

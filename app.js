require('dotenv').config();

const Snoowrap = require ('snoowrap');
const Snoostorm = require('snoostorm');


//Build snoowrap and Snoostorm
const r = new Snoowrap({
    userAgent: 'mnzpbot',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

const redditClient = new Snoostorm(r);


// Configure options for stream: subreddit & results per query
const streamOpts = {
    subreddit: 'modelnzparliament',
    limit: 100,
    pollTime: 2000,
};


// Create a Snoostorm CommentStream with the specified options
const comments = redditClient.CommentStream(streamOpts);

// Google Sheets
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

//Discord
const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
	var today = new Date();
	var currentTime = today.getHours() + ":" + today.getMinutes();
    client.user.setPresence({
        game: {
            name: '/r/ModelNZParliament',
            type: "WATCHING"
        }
    });
});



var bill;
var args = 1;

var sponsor;
var author;
var portfolio;
var title;
var firstRead;
var stage;
var billStatus;
var notes;

var messageOrigin;

var resultsBill;
var resultsName;
var resultsStage;
var resultsAyes;
var resultsAbstains;
var resultsNoes;
var resultsDNVs;
var resultsResult;
var resultsAmendment;

client.on('message', message => {
	if (message.author.bot) return;
    //if (message.content.toLowerCase().includes('maori')) {
    //    message.channel.send('Here\'s a macron! Māori')
    //}
	if (message.content === config.prefix + 'ping') {
		message.channel.send('Pong.');
	}
	if (message.content === config.prefix + 'submit') {
		message.channel.send('You can submit bills & motions using the form: https://forms.gle/QXMa846mvSfwfjuZ6 or by DMing me "submit".');
	}
	if (message.content.startsWith(config.prefix + 'bill')) {
		args = message.content.slice(6);
		if (!args.length) {
			return message.channel.send('You didn\'t provide a bill number. E.g. ?bill 84');
		}
		if (isNaN(args)) {
			return message.channel.send('Bill number must be a number. E.g. ?bill 84');
		}
		
		messageOrigin = message;
		
		fs.readFile('credentials.json', (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		// Authorize a client with credentials, then call the Google Sheets API.
		authorize(JSON.parse(content), listBillInfo);
		});
	}
    if (message.content.startsWith(config.prefix + 'draw')) {
        if (message.author.id === "219713637890129921" || message.author.id === "615817105001938953") {
		args = message.content.slice(6);
		if (!args.length) {
			return message.channel.send('You didn\'t provide a number of bills to draw. E.g. ?draw 2');
		}
		if (isNaN(args)) {
			return message.channel.send('Draw number must be a number. E.g. ?draw 2');
		}
		
		messageOrigin = message;
        message.channel.send('Drawing ' + args + ' bills from the biscuit tin.')
		
		fs.readFile('credentials.json', (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		// Authorize a client with credentials, then call the Google Sheets API.
		authorize(JSON.parse(content), drawBiscuitTin);
		});
        }
	}
	if (message.content === config.prefix + 'stop') {
		if (message.author.id === "219713637890129921") {
			message.channel.send('Stopping bot...');
			process.exit();
		}
	}
	if (message.content.startsWith(config.prefix + 'post')) {
        if (message.author.id === "219713637890129921"|| message.author.id === "615817105001938953" || message.author.id === "222163140496850944") {
		args = message.content.slice(6);
        console.log('bruh');
		if (!args.length) {
			return message.channel.send('You didn\'t provide a row number to post from. E.g. ?post 138');
		}
            console.log('bruh2');
		if (isNaN(args)) {
			return message.channel.send('Row must be a number. E.g. ?post 138');
		}
		console.log('bruh3');
		//messageOrigin = message;
        message.channel.send('Posting item from row ' + args + '.')
		
		fs.readFile('credentials.json', (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		// Authorize a client with credentials, then call the Google Sheets API.
		authorize(JSON.parse(content), postVoteToReddit);
		});
        }
    }
	if (message.content.startsWith(config.prefix + 'results')) {
		if (message.author.id === "219713637890129921"|| message.author.id === "615817105001938953" || message.author.id === "222163140496850944") {
		args = message.content.slice(9);
		if (!args.length) {
			return message.channel.send('You didn\'t provide a column letter. E.g. ?results T');
		}
		if (!isNaN(args)) {
			return message.channel.send('Column letter must not include numbers. E.g. ?results T');
		}
		
		message.channel.send('Getting results from column: ' + args);
		
		messageOrigin = message;
		
		fs.readFile('credentials.json', (err, content) => {
		if (err) return console.log('Error loading client secret file:', err);
		// Authorize a client with credentials, then call the Google Sheets API.
		authorize(JSON.parse(content), getColumnResults);
		});
		}
	}
	if (message.content === 'submit' && message.guild === null) {
		var billType;
		var billTitle;
		var billAuthor;
		var billParty;
		var billContent;
		var billType2;
		var billPortfolio;
		message.channel.send('Beginning legislation submission process. You will have 30 seconds after each message to reply. Type "exit" at any time to exit the process. Is your legislation a motion or bill?')
		.then(() => {
		message.channel.awaitMessages(response => response.content.toLowerCase() === 'bill' || response.content.toLowerCase() === 'motion' && message.author.bot == false, {
			max: 1,
			time: 30000,
			errors: ['time'],
		})
		.then((collected) => {
			billType = collected.first().content;
			message.channel.send('What is the title? (e.g. Discord Abolition Bill)')
			.then(() => {
			message.channel.awaitMessages(response => response.content !== 'exit' && message.author.bot == false, {
				max: 1,
				time: 30000,
				errors: ['time'],
			})
			.then((collected) => {
				billTitle = collected.first().content;
			message.channel.send('Who is/are the author(s)? (Important: You must correctly attribute the author, strict penalties for plagiarism apply. This includes legislation taken from real life politicians. You may attribute multiple authors (including yourself) if necessary.)')
			.then(() => {
			message.channel.awaitMessages(response => response.content !== 'exit' && message.author.bot == false, {
				max: 1,
				time: 30000,
				errors: ['time'],
			})
			.then((collected) => {
				billAuthor = collected.first().content;
			message.channel.send('What party do you belong to?')
			.then(() => {
			message.channel.awaitMessages(response => response.content !== 'exit' && message.author.bot == false, {
				max: 1,
				time: 30000,
				errors: ['time'],
			})
			.then((collected) => {
				billParty = collected.first().content;
			message.channel.send('What is the content of your legislation (May provide markdown or link - if submitting HackMD document, I suggest changing the permissions so that only you can edit it: https://i.imgur.com/4cjteWr.png)')
			.then(() => {
			message.channel.awaitMessages(response => response.content !== 'exit' && message.author.bot == false, {
				max: 1,
				time: 30000,
				errors: ['time'],
			})
			.then((collected) => {
				billContent = collected.first().content;
				if (billType.toLowerCase() === 'motion') {
					message.channel.send('Legislation submission process complete, your responses have been submitted. If you have encountered any errors or made any mistakes, let a member of the Speakership know.');
					client.channels.get("607164894650957850").send("**Order, Order!** New legislation submitted by <@" + message.author.id + "> \n\n**Type** \n" + billType + "\n\n**Title** \n" + billTitle + "\n\n**Author** \n" + billAuthor + "\n\n**Party** \n" + billParty + "\n\n**Content** \n" + billContent);
				} else {
					message.channel.send('Which type of bill are you submitting? (Government, Members, Party)')
			.then(() => {
			message.channel.awaitMessages(response => response.content.toLowerCase() === 'government' || response.content.toLowerCase() === 'members' || response.content.toLowerCase() === 'party' && message.author.bot == false, {
				max: 1,
				time: 30000,
				errors: ['time'],
			})
			.then((collected) => {
				billType2 = collected.first().content;
				if (billType2.toLowerCase() === 'members' || billType2.toLowerCase() === 'party') {
					message.channel.send('Legislation submission process complete, your responses have been submitted. If you have encountered any errors or made any mistakes, let a member of the Speakership know.');
					client.channels.get("607164894650957850").send("**Order, Order!** New legislation submitted by <@" + message.author.id + "> \n\n**Type** \n" + billType + "\n\n**Title** \n" + billTitle + "\n\n**Author** \n" + billAuthor + "\n\n**Party** \n" + billParty + "\n\n**Content** \n" + billContent + "\n\n**Bill Type** \n" + billType2);
				} else {
					message.channel.send('Which ministerial portfolio is this bill being submitted under?')
			.then(() => {
			message.channel.awaitMessages(response => response.content !== 'exit' && message.author.bot == false, {
				max: 1,
				time: 30000,
				errors: ['time'],
			})
			.then((collected) => {
				billPortfolio = collected.first().content;
				message.channel.send('Legislation submission process complete, your responses have been submitted. If you have encountered any errors or made any mistakes, let a member of the Speakership know.');
				client.channels.get("607164894650957850").send("**Order, Order!** New legislation submitted by <@" + message.author.id + "> \n\n**Type** \n" + billType + "\n\n**Title** \n" + billTitle + "\n\n**Author** \n" + billAuthor + "\n\n**Party** \n" + billParty + "\n\n**Content** \n" + billContent + "\n\n**Bill Type** \n" + billType2 + "\n\n**Portfolio** \n" + billPortfolio);
				})
			});				
			}
				})
				})
			}				
			});
			})
			})
			});				
			})
			});
			});
			})
			})
		});
		}
});

client.login(config.token);

// list bill info script
 
function listBillInfo(auth) {
  bill = parseInt(args, 10);
  bill = bill + 3;
  var sheetRange = 'Bills!D' + bill + ':K' + bill;
  console.log('Checking bill info on range ' + sheetRange);
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1FS9o_Jhm8ZhBOGHkQBg57rStmQQ3DGqJWcPo4fvKihQ',
    range: sheetRange,
	majorDimension: 'COLUMNS',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
	res.data.values.push('no notes');
	sponsor = res.data.values[0].toString();
	author = res.data.values[1].toString();
	portfolio = res.data.values[2].toString();
	title = res.data.values[3].toString();
	firstRead = res.data.values[4].toString();
	stage = res.data.values[5].toString();
	billStatus = res.data.values[6].toString();
	
	if (author === '') {
		author = sponsor;
	}
			
	messageOrigin.channel.send('**' + title + '**\nSponsor: ' + sponsor + '\nAuthor: ' + author + '\nPortfolio: ' + portfolio + '\nFirst Read: ' + firstRead + '\nStage: ' + stage + '\nStatus: ' + billStatus);
  });
}

function getColumnResults(auth) {
  var sheetRange = '9th Term Voting Sheet!' + args + '1:' + args + '55';
  console.log('Gettings results on range ' + sheetRange);
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1FS9o_Jhm8ZhBOGHkQBg57rStmQQ3DGqJWcPo4fvKihQ',
    range: sheetRange,
	majorDimension: 'ROWS',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
	resultsBill = res.data.values[4].toString();
	resultsStage = res.data.values[6].toString();
	resultsAyes = res.data.values[50].toString();
	resultsAbstains = res.data.values[51].toString();
	resultsNoes = res.data.values[52].toString();
	resultsDNVs = res.data.values[53].toString();
	resultsResult = res.data.values[54].toString();
	
	if (resultsResult === 'PASS') {
		resultsResult = 'Ayes';
	} else if (resultsResult === 'FAIL') {
		resultsResult = 'Noes';
	}
	if (resultsStage === 'FIRST') {
		resultsStage = 'FIRST VOTE';
		resultsAmendment = false;
	} else if (resultsStage === 'COM.') {
		resultsStage = 'COMMITTEE';
		resultsAmendment = false;
	} else if (resultsStage === 'FINAL') {
		resultsStage = 'FINAL VOTE';
		resultsAmendment = false;
	} else if (resultsStage.startsWith('S.')) {
		resultsAmendment = true;
	}
	
	if (resultsAmendment === false) {
		bill = resultsBill.slice(2);
		bill = parseInt(bill, 10);
		bill = bill + 3;
		var sheetRange = 'Bills!F' + bill + ':H' + bill;
		console.log('Checking bill info on range ' + sheetRange);
		const sheets = google.sheets({version: 'v4', auth});
		sheets.spreadsheets.values.get({
			spreadsheetId: '1FS9o_Jhm8ZhBOGHkQBg57rStmQQ3DGqJWcPo4fvKihQ',
			range: sheetRange,
			majorDimension: 'COLUMNS',
		}, (err, res) => {
			if (err) return console.log('The API returned an error: ' + err);
			resultsName = res.data.values[1].toString();
			messageOrigin.channel.send('```# ' + resultsBill + ' - ' + resultsName + ' [' + resultsStage + ']\n\nThe Ayes are **' + resultsAyes + '.**\n\nThe Noes are **' + resultsNoes + '.**\n\n**' + resultsAbstains + '** abstained, **' + resultsDNVs + '** did not vote.\n\n**The ' + resultsResult + ' have it!**```');
		});
		return;
	}

	messageOrigin.channel.send('```### ' + resultsStage + '\n\nThe Ayes are **' + resultsAyes + '.**\n\nThe Noes are **' + resultsNoes + '.**\n\n**' + resultsAbstains + '** abstained, **' + resultsDNVs + '** did not vote.\n\n**The ' + resultsResult + ' have it!**```');
  });
}

var postTitle;
var postContent;

function postVoteToReddit(auth) {
  var sheetRange = '9th Term Order Paper!D' + args + ':G' + args;
  console.log('Gettings results on range ' + sheetRange);
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1FS9o_Jhm8ZhBOGHkQBg57rStmQQ3DGqJWcPo4fvKihQ',
    range: sheetRange,
	majorDimension: 'COLUMNS',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
	var postNumber = res.data.values[0].toString();
	var postName = res.data.values[1].toString();
	var postStage = res.data.values[2].toString();
	var postEnds = res.data.values[3].toString();
	
	postStage = postStage.toUpperCase();
      
    postTitle = postNumber + ' - ' + postName + ' [' + postStage + ']';
    postContent = '**Order,**\n\nThe question is that the motion be agreed to.\n\nAll those in favour will say Aye, and to the contrary No.\n\n***\n\nThe debates on the bill can be found [here.](https://www.reddit.com/r/ModelNZParliament/search?q=' + postNumber + '&restrict_sr=on&sort=new&t=all)\n\nThe voting period will end at 6 PM ' + postEnds;
	
	r.submitSelfpost({
      subredditName: 'modelnzmp',
      title: postTitle,
      text: postContent
    }).then(console.log)
  });
}

//point of order notification
comments.on('comment', (comment) => {
  if (comment.body.toLowerCase().includes("point of order")) {
	  client.channels.get("434869181947838464").send("New point of order: https://reddit.com" + comment.permalink);
  }
});

//Have bot submit self post
//r.submitSelfpost({
//  subredditName: 'mnzptesting',
//  title: 'This is a selfpost',
//  body: 'This is the body of the selfpost'
//}).then(console.log)
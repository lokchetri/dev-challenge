/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const Process = require('./site/process')
const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
	if (global.DEBUG) {
		console.info(msg)
	}
}

// Data initialization
const currency = [
    { name: 'gbpusd', bestBid: 0, bestAsk: 0, lastChangeBid: 0 },
    { name: 'gbpeur', bestBid: 0, bestAsk: 0, lastChangeBid: 0 },
    { name: 'gbpaud', bestBid: 0, bestAsk: 0, lastChangeBid: 0 },
    { name: 'usdeur', bestBid: 0, bestAsk: 0, lastChangeBid: 0 },
    { name: 'gbpjpy', bestBid: 0, bestAsk: 0, lastChangeBid: 0 },
    { name: 'usdjpy', bestBid: 0, bestAsk: 0, lastChangeBid: 0 },
    { name: 'eurjpy', bestBid: 0, bestAsk: 0, lastChangeBid: 0 },
    { name: 'gbpchf', bestBid: 0, bestAsk: 0, lastChangeBid: 0 },
    { name: 'euraud', bestBid: 0, bestAsk: 0, lastChangeBid: 0 },
    { name: 'eurchf', bestBid: 0, bestAsk: 0, lastChangeBid: 0 },
    { name: 'eurcad', bestBid: 0, bestAsk: 0, lastChangeBid: 0 },
    { name: 'gbpcad', bestBid: 0, bestAsk: 0, lastChangeBid: 0 }
];
// Create table	
Process.createTable(currency);

function connectCallback() {
    document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
    client.subscribe('/fx/prices', function(message) {
        console.log("received message : " + message.body);
        var data = JSON.parse(message.body);
        currency.forEach(item => {
                if (item.name == data.name) {
                    item.bestBid = data.bestBid;
                    item.bestAsk = data.bestAsk;
                    item.lastChangeBid = data.lastChangeBid;
                    // Update row based on currency name
                    Process.updateTableRow(data);
                }
        })
        // Sort table by 'Last Bid Price' column
        Process.sortTable('table1', 3, 'asc');
        // Once we get a message, the client disconnects
        //client.disconnect();
    })
}

client.connect({}, connectCallback, function(error) {
    alert(error.headers.message)
})

const exampleSparkline = document.getElementById('example-sparkline')
//Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])

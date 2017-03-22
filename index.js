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

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
        if (global.DEBUG) {
            console.info(msg)
        }
    }
    //Data initialization
var currency = [
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

//Create table	
createTable(currency);

function connectCallback() {
    document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
    console.log('Connected to Stomp.');
    client.subscribe('/fx/prices', function(message) {
        console.log("received message : " + message.body);
        var data = JSON.parse(message.body);
        currency.forEach(function(item) {
                if (item.name == data.name) {
                    item.bestBid = data.bestBid;
                    item.bestAsk = data.bestAsk;
                    item.lastChangeBid = data.lastChangeBid;
                    //Update row based on currency name
                    updateTableRow(data);
                }
            })
            //Sort table
        sortTable('table1', 3, 'asc');
        // once we get a message, the client disconnects
        //client.disconnect();
    })
}

client.connect({}, connectCallback, function(error) {
    alert(error.headers.message)
})

const exampleSparkline = document.getElementById('example-sparkline')
    //Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])


function createTable(data) {
    var tableContainerDiv = document.getElementById("stomp-response");
    var table = document.createElement('table');
    table.border = '1';
    table.id = 'table1';
    //Create thead
    var thTitle = ['Currency', 'Current Best Bid Price', 'Current Best Ask Price', 'Last Bid Price', 'Sparkline'];
    var tableHead = document.createElement('thead');
    table.appendChild(tableHead);
    var tr = document.createElement('tr');
    tableHead.appendChild(tr);
    for (let j = 0; j < thTitle.length; j++) {
        var th = document.createElement('th');
        th.width = '75';
        th.appendChild(document.createTextNode(thTitle[j]));
        tr.appendChild(th);
    }
    //Create tbody
    var tableBody = document.createElement('tbody');
    table.appendChild(tableBody);
    //Create rows
    for (let i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');
        tableBody.appendChild(tr);
        var propName = ['name', 'bestBid', 'bestAsk', 'lastChangeBid', 'sparkline'];
        for (let j = 0; j < propName.length; j++) {
            var td = document.createElement('td');
            td.width = '75';
            switch (j) {
                case 0:
                    td.appendChild(document.createTextNode(data[i].name));
                    break;
                case 1:
                    td.appendChild(document.createTextNode(data[i].bestBid));
                    break;
                case 2:
                    td.appendChild(document.createTextNode(data[i].bestAsk));
                    break;
                case 3:
                    td.appendChild(document.createTextNode(data[i].lastChangeBid));
                    break;
                default:
                    td.classList.add('sparkline');
                    td.appendChild(document.createTextNode(''));
            }
            tr.appendChild(td);
        }
    }
    tableContainerDiv.appendChild(table);
}

function updateTableRow(data) {
    var table = document.getElementById('table1');
    var rows = table.rows;
    var r = 0;
    var rowFound = false;
    //Loop through rows and search row to update
    for (; r < rows.length; r += 1) {
        row = rows.item(r);
        rowFound = (row.cells.item(0).textContent.indexOf(data.name) !== -1);
        if (rowFound) {
            //Update row data
            row.cells.item(1).innerHTML = data.bestBid;
            row.cells.item(2).innerHTML = data.bestAsk;
            row.cells.item(3).innerHTML = data.lastChangeBid;
            var midPrice = (parseFloat(data.bestBid) + parseFloat(data.bestAsk)) / 2;
            Sparkline.draw(row.cells.item(4), data.midPrice);
        }
    }
}

function sortTable(tableId, columnIndex, order) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchCount = 0;
    table = document.getElementById(tableId);
    switching = true;
    //Sorting direction
    dir = order;
    //Make a loop that will continue until no switching has been done
    while (switching) {
        //Start by saying: no switching is done
        switching = false;
        rows = table.getElementsByTagName("TR");
        //Loop through all table rows (except the first, which contains table headers)
        for (i = 1; i < (rows.length - 1); i++) {
            //Start by saying there should be no switching
            shouldSwitch = false;
            //Get the two elements you want to compare,one from current row and one from the next
            x = rows[i].getElementsByTagName("TD")[columnIndex];
            y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
            //check if the two rows should switch place, based on the direction, asc or desc
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            //If a switch has been marked, make the switch and mark that a switch has been done
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchCount++;
        } else {
            //If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loo again
            if (switchCount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
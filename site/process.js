"use strict";
var messageProcessor = function (){
	this._stompClient = null;
}
messageProcessor.prototype.createTable = function (tableId, data) {
    var tableContainerDiv = document.getElementById("stomp-response");
    var table = document.createElement('table');
    table.border = '1';
    table.id = tableId;
    // Create thead
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
    // Create tbody
    var tableBody = document.createElement('tbody');
    table.appendChild(tableBody);
    // Create rows
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

messageProcessor.prototype.updateTableRow = function(tableId, data) {
    var table = document.getElementById(tableId);
    var rows = table.rows;
    var r = 0;
    var rowFound = false;
    // Loop through rows and search row to update
    for (; r < rows.length; r++) {
        let row = rows.item(r);
        rowFound = (row.cells.item(0).textContent.indexOf(data.name) !== -1);
		row.classList.remove("highlight");
        if (rowFound) {
            //Update row data
			row.classList.add("highlight");
            row.cells.item(1).innerHTML = data.bestBid;
            row.cells.item(2).innerHTML = data.bestAsk;
            row.cells.item(3).innerHTML = data.lastChangeBid;
            Sparkline.draw(row.cells.item(4), data.midPrice);
        }
    }
}

messageProcessor.prototype.sortTable = function(tableId, columnIndex, order) {
    var table, rows, switching, i, x, y, shouldSwitch, switchCount = 0;
    table = document.getElementById(tableId);
    switching = true;
    // Make a loop that will continue until no switching has been done
    while (switching) {
        // Start by saying: no switching is done
        switching = false;
        rows = table.getElementsByTagName("tr");
        // Loop through all table rows (except the first, which contains table headers)
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching
            shouldSwitch = false;
            // Get the two elements you want to compare,one from current row and one from the next
            x = rows[i].getElementsByTagName("td")[columnIndex];
            y = rows[i + 1].getElementsByTagName("td")[columnIndex];
            // Check if the two rows should switch place, based on the direction, asc or desc
            if (order == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (order == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            // If a switch has been marked, make the switch and mark that a switch has been done
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchCount++;
        }
    }
}
module.exports = new messageProcessor();
/**
 * Chatwork fav
 *
 * @version 0.1
 * @author MIZUSHIMA Junki <j@mzsm.me>
 * @license The MIT License.
 */
/// <reference path="chrome.d.ts" />
/// <reference path="initialize_idb.ts" />

"use strict";

interface IDBCursor {
    value: any;
}
interface Object {
    [idx: string]: any;
}

idb.open(function(db: IDBDatabase){
    var res = document.getElementById('favlist');
    var transaction: IDBTransaction = db.transaction(['messages'], "readonly");
    var store = transaction.objectStore('messages');
    store.openCursor().onsuccess = function(event){
        var cursor = <IDBCursor>(<IDBRequest>event.target).result;
        if(cursor){
            var value: Object = <Object>cursor.value;
            var row = document.createElement('tr');
            var td = document.createElement('td')
            td.innerText = value['text'];
            row.appendChild(td);
            var td = document.createElement('td')

            var anchor = document.createElement('a');
            var date = new Date();
            date.setTime(parseInt(value['favoritedAt']));
            anchor.innerText = date.toLocaleString();
            anchor.className = 'jump'
            anchor.href = 'https://www.chatwork.com/#!rid' + value['rid'] + '-' + ['mid'];
            td.appendChild(anchor);

            row.appendChild(td);
            res.appendChild(row);
            cursor.continue();
        }else{
            /*
            var nodes: NodeList = document.getElementsByClassName('jump');
            for(var i=0; i<nodes.length; i++){
                var node = nodes[i];
                node.addEventListener('click', function(event: MouseEvent){
                    //stub...
                });
            }
            */
        }
    };
});

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

interface MessageFromContent {
    eventType: string;
    payload: any;
}
interface addFavoritePayload {
    room: {
        rid: string;
        name?: string;
    };
    account: {
        aid: string;
        name: string;
    };
    message: {
        mid: string;
        rid: string;
        aid: string;
        text: string;
        favoritedAt: string;
    };
}

function addFavorite(payload: addFavoritePayload){
    idb.open(function(db: IDBDatabase){
        var transaction = db.transaction(['messages'], 'readwrite');
        var objectStore = transaction.objectStore('messages')
        objectStore.put(payload.message);

        transaction.oncomplete = function(e){
            //console.log(e);
        };
        transaction.onerror = function(e){
            //console.log(e);
        };
    });
};

function removeFavorite(mid: string){
    idb.open(function(db: IDBDatabase){
        var transaction = db.transaction(['messages'], 'readwrite');
        var objectStore = transaction.objectStore('messages')
        objectStore.delete(mid);
    });
};

chrome.runtime.onMessage.addListener(function(msg: MessageFromContent){
    switch(msg.eventType){
        case 'add':
            addFavorite(msg.payload);
            break;
        case 'remove':
            removeFavorite(msg.payload);
        default :
            console.log('undefined message');
            console.log(msg);
    }
});
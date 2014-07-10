/**
 * Chatwork fav
 *
 * @version 0.1
 * @author MIZUSHIMA Junki <j@mzsm.me>
 * @license The MIT License.
 */
/// <reference path="chrome.d.ts" />
"use strict";

// TODO: Jaidを使うようにする
class IDB {
    db: IDBDatabase;
    open(callback: Function): void{
        if(this.db){
            setTimeout(() => {
                callback(this.db);
            })
        }else{
            var idb: IDBOpenDBRequest = indexedDB.open('chatworkfavs', 1);

            idb.onsuccess = (event: Event) => {
                this.db = <IDBDatabase>(<IDBOpenDBRequest>event.target).result;
                callback(this.db);
            };
            idb.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                var db = <IDBDatabase>(<IDBOpenDBRequest>event.target).result;
                db.createObjectStore('accounts', {keyPath: 'aid'});
                db.createObjectStore('rooms', {keyPath: 'rid'});
                var messages = db.createObjectStore('messages', {keyPath: 'mid'});
                messages.createIndex('aid', 'aid');
                messages.createIndex('rid', 'rid');
                messages.createIndex('favoritedAt', 'favoritedAt');
            };
        }
    }
}

var idb = new IDB();
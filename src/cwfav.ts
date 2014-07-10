/**
 * Chatwork fav
 *
 * @version 0.1
 * @author MIZUSHIMA Junki <j@mzsm.me>
 * @license The MIT License
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
/// <reference path="chrome.d.ts" />
"use strict";

interface Object {
    [idx: string]: any;
}

module CWFav {
    export function toggleFav(event: MouseEvent){
        var srcElement:HTMLElement = <HTMLElement>(event.srcElement || event.target);
        var message: HTMLElement = getMessageElement(srcElement);
        var messageId: string = <string>message.dataset['mid'];
        if(srcElement.classList.contains('favorited')){
            //localStorage.removeItem(messageId);
        }else{
            var roomId: string = <string>message.dataset['rid'];
            var text: string = message.getElementsByTagName('pre')[0].innerText;
            var account: Object = getAccount(message);
            var favoritedAt = new Date().getTime().toString();

            chrome.runtime.sendMessage({
                eventType: 'add',
                payload: {
                    room: {
                        rid: roomId
                    },
                    account: account,
                    message: {
                        mid: messageId,
                        aid: account['aid'],
                        rid: roomId,
                        text: text,
                        favoritedAt: favoritedAt
                    }
                }
            });
        }
        _favCheck(srcElement, messageId);
    }

    export function getMessageElement(element: HTMLElement): HTMLElement {
        while (!element.classList.contains('chatTimeLineMessage')) {
            element = element.parentElement;
        }
        return element;
    }

    export function getAccount(element: HTMLElement): Object{
        while(!element.getElementsByClassName('avatarSpeaker').length){
            element = <HTMLElement>element.previousElementSibling;
        }
        var avatar = <HTMLElement>element.getElementsByClassName('_avatar')[0];
        var accountId: string = <string>avatar.dataset['aid'];
        var name: string = (<HTMLElement>element.getElementsByClassName('_nameAid' + accountId)[0]).innerText;
        return {aid: accountId, name: name};
    }

    export function _getMessageId(element: HTMLElement): string{
        element = getMessageElement(element);
        return <string>element.dataset['mid'];
    }

    export function _favCheck(srcElement: HTMLElement, messageId: string): void{
        /*
        if(localStorage.getItem(messageId)){
            srcElement.className = 'favButton icoSizeSmall favorited';
        }else{
            srcElement.className = 'favButton icoSizeSmall';
        }
        */
        srcElement.className = 'favButton icoSizeSmall';
    }
}

//チャットのメッセージがDOMに読み込まれたときにイベントを捕獲
document.getElementById('_timeLine').addEventListener('DOMNodeInserted', function(event){
    var msg: HTMLElement = <HTMLElement>(event.srcElement || event.target);
    if(!msg.classList.contains('chatTimeLineMessage')){
        return;
    }
    //ふぁぼボタンを挿入
    var timestampArea = msg.getElementsByClassName('timeStamp')[0];

    var btn = document.createElement('span');
    btn.innerText = '★';
    var messageId = CWFav._getMessageId(msg);
    CWFav._favCheck(btn, messageId);
    timestampArea.appendChild(btn);
    btn.addEventListener('click', CWFav.toggleFav);

});
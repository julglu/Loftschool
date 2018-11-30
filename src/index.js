import './css/main.css';
import './js/DnD';
import { auth, callAPI } from './js/VK'
import { isMatching } from './js/utils';
import template from './templates/friend-list.hbs';

const generalListBlock = document.getElementById('general');
const selectedListBlock = document.getElementById('selected');
const generalFilter = document.getElementById('filter-general-input');
const selectedFilter = document.getElementById('filter-selected-input');

let storage = localStorage;
let generalList;
let selectedList;

auth()
    .then (()=>{
        return callAPI('friends.get', { fields: 'photo_50' });
    })
    .then((friends)=>{
        generalList = storage.general ? JSON.parse(storage.general) : friends.items;
        selectedList = storage.selected ? JSON.parse(storage.selected) : [];

        reDrawFriendList(generalListBlock, generalList, generalFilter);
        reDrawFriendList(selectedListBlock, selectedList, selectedFilter);
    });

document.addEventListener('click', e => {

    if (e.target.classList.contains('friend-btn')) {

        const friendBlock = e.target.parentNode;
        const listBlock = friendBlock.parentNode;
        const friendListStatus = getListStatus(listBlock);
        const listBlockID = listBlock.classList.contains('general') ? 'selected' : 'general';
        const selectedFriendsBlock = document.getElementById(listBlockID);

        listBlock.removeChild(friendBlock);
        selectedFriendsBlock.appendChild(friendBlock);

        changeFriendLists(friendBlock, friendListStatus.currList, friendListStatus.futureList);

    } else if (e.target.classList.contains('save-btn')) {
        // Сохранить оба списка в LocalStorage
        storage.general = JSON.stringify(generalList);
        storage.selected = JSON.stringify(selectedList);
    }
});

document.addEventListener('friendDrop', (e) => {
    const droppedFriend = document.querySelector('.dropped-friend');

    if (droppedFriend) {

        if (e.target.classList.contains('friend')) {
            const friendListStat = getListStatus(droppedFriend.parentNode);
            const afterBlock = document.querySelector('.insert-after');

            changeFriendLists(droppedFriend, friendListStat.futureList, friendListStat.currList, afterBlock.dataset.id);
            afterBlock.classList.remove('insert-after');

        } else if (e.target.classList.contains('list')) {
            const friendListStat = getListStatus(droppedFriend.parentNode);

            changeFriendLists(droppedFriend, friendListStat.futureList, friendListStat.currList);
        }

        droppedFriend.classList.remove('dropped-friend');
    }
});

generalFilter.addEventListener('keyup', () => {
    reDrawFriendList(generalListBlock, generalList, generalFilter);
});

selectedFilter.addEventListener('keyup', () => {
    reDrawFriendList(selectedListBlock, selectedList, selectedFilter);
});

function getListStatus(listBlock) {
    let currentList;
    let futureList;

    if (listBlock.classList.contains('general')) {
        currentList = generalList;
        futureList = selectedList;

    } else {
        currentList = selectedList;
        futureList = generalList;
    }

    return { currList: currentList, futureList: futureList };
}

function changeFriendLists(friendBlock, fromList, toList, afterID) {
    // убираем друга из текущего списка
    const friend = fromList.splice(fromList.findIndex(element => element.id === +friendBlock.dataset.id), 1);

    // вставляем друга в новый список
    if (afterID) {
        toList.splice(toList.findIndex(element => element.id === +afterID) + 1, 0, friend[0]);

    } else {
        toList.push(friend[0]);
    }
}

function reDrawFriendList(block, friendList, filter) {
    let items = friendList.filter(f => isMatching(f.first_name, filter.value) || isMatching(f.last_name, filter.value));

    block.innerHTML = template({ items });

}


/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
const btnTryAgain = document.createElement('button');

btnTryAgain.innerText = 'Повторить';
btnTryAgain.style.display = 'none';
homeworkContainer.appendChild(btnTryAgain);

btnTryAgain.addEventListener('click', load);

const url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    return new Promise(function (resolve, reject) {
        resolve(
            fetch(url)
                .then(function (responce) {
                    if (responce.status >= 400) {
                        return reject();
                    }

                    return responce.json();
                })
                .then(function (towns) {
                    towns.sort(function (a, b) {
                        return a.name.localeCompare(b.name);
                    });

                    return towns;
                })
        );
    });
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    if (chunk) {
        return full.toLowerCase().indexOf(chunk.toLowerCase()) >= 0;
    }

    return false;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

let townList = [];

load();

function load() {

    loadingBlock.style.display = 'block';

    loadTowns()
        .then(function (towns) {
            townList = towns;
            btnTryAgain.style.display = 'none';
            loadingBlock.style.display = 'none';
            filterBlock.style.display = 'block';
        })
        .catch(function () {
            loadingBlock.innerText = 'Не удалось загрузить города';
            btnTryAgain.style.display = 'block';
        });

}

filterInput.addEventListener('keyup', function (e) {
    // это обработчик нажатия кливиш в текстовом поле
    filterResult.innerHTML = '';

    for (let town of townList) {

        if (isMatching(town.name, e.target.value)) {
            let li = document.createElement('li');

            li.innerText = town.name;
            li.style.listStyleType = 'none';
            filterResult.appendChild(li);
        }
    }

});

export {
    loadTowns,
    isMatching
};

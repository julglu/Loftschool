/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    const newDiv = document.createElement('div');
    const width = Math.round(Math.random() * 200 + 20),
        height = Math.round(Math.random() * 200 + 20),
        top = Math.round(Math.random() * (window.innerHeight - height)),
        left = Math.round(Math.random() * (window.innerWidth - width));

    newDiv.style.position = 'absolute';
    newDiv.style.width = width + 'px';
    newDiv.style.height = height + 'px';
    newDiv.style.top = top + 'px';
    newDiv.style.left = left + 'px';
    newDiv.style.backgroundColor = '#' + (Math.random() * 0xffffff + 0x1000000).toString(16).substr(1, 6);

    newDiv.classList.add('draggable-div');

    return newDiv;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function checkBoundings(coordinate, up, down) {

    if (coordinate >= up && coordinate <= down) {
        return coordinate;
    } else if (coordinate < up) {
        return up;
    }

    return down;
}

function addListeners(target) {
    let mouseOffset = {};

    document.addEventListener('mousemove', event => {
        if (!target.classList.contains('draggable')) {
            return false;
        }

        let x = checkBoundings(event.pageX - mouseOffset.X, 0, window.innerWidth - parseInt(target.style.width, 10)),
            y = checkBoundings(event.pageY - mouseOffset.Y, 0, window.innerHeight - parseInt(target.style.height, 10));

        target.style.left = x + 'px';
        target.style.top = y + 'px';

    });

    target.addEventListener('mousedown', event => {
        target.classList.add('draggable');
        mouseOffset = {
            X: event.layerX,
            Y: event.layerY
        };
    });

    document.addEventListener('mouseup', () => {
        target.classList.remove('draggable');
    })
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};

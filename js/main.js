const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

// Создаем массив которые будет содержать все задачи.
// При создание задачБ новые задачи будут добавляться в этот массив

// Начинаем с добавление задачи. 1. Открываем function addTask.
// Чтобы добавить задачу надо СФОРМИРОВАТЬ ОБЪЕКТ которые будет ОПИСЫВАТЬ задачу
let tasks = [];

// Проверяем localStorage, если есть данные то мы их получаем и записываем в массив tasks
// 'tasks' - ключ, по которому мы получаем данные. Если есть данные по такому ключу, то они вернуться
// getItem - вернул либо СТРОЧКУ, либо NULL
// любая строка - ИСТИНОЕ ВЫРАЖЕНИЕ

if(localStorage.getItem('tasks')){
      // к нам приходи СТРОКА, превращаем её в JS массив --> используем метод parse()
      // 1. срабатывает localStorage.getItem('tasks')
      // 2. образуется строка
      // 3. работает JSON.parse()
      tasks = JSON.parse (localStorage.getItem('tasks')) ;
      //Отображаем задачи из localStorage
        // forEach - проходит по всем эелементам массива и вызывает функцию для каждого эл-та 
        tasks.forEach((task) => renderTask(task))  
}




checkEmptyList();


// Отслеживаем событие - отправка формы 
form.addEventListener('submit', addTask);


// Удаление задачи
tasksList.addEventListener('click', deleteTask);


// Отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask)


// Функции

function addTask(event){
    event.preventDefault(); // Отменяем стандартное поведение

    /// Достаем текст задачи из поля ввода

    const taskText = taskInput.value;


    // Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(), // вызываем now у класса Data - будет сформированно текущее время в млсек
                        // таким образом при создание новой задачи id будет новый и уникальный
        text: taskText,
        done: false
    };

    // Добавляем этот оъект в массив с задачей
    tasks.push(newTask)

    // Добавляем задачу в хранилице браузера localStorage
    saveToLocalStorage()


    renderTask(newTask)


    /// Очищаем поле ввода и возвращаем фокус в поле
    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();
    

    // Скрываем верхний блок
    // Если в списке задач больше одного элемента, то мы скрываем верхний блог

    // if(tasksList.children.length > 1){
    //     emptyList.classList.add('none')
    // }
}

function deleteTask(event){
    // Под event.target - мы видим тот элемент на какой произошел клик

    if(event.target.dataset.action !== 'delete') return;

    const pareNode = event.target.closest('.list-group-item'); // Находим родительский тег <li></li>

    // Определяем ID
    const id = Number(pareNode.id)
    
    // УДАЛЯЕМ по INDEX. Находим INDEX в массиве
    // findIndex - принимает в себя в функцию, которую запускает оп очереди для каждого элемента массива

    const index = tasks.findIndex((task) =>  task.id === id) // результат сравнения. Если ID = искомому id => возврящается true, иначе false
    


    //Удаляем задачу из массива
    // Метод splice - 1аргумент - тот index с которого надо начинать вырезать элемент
                    //2 аргумент - кол-во элементов которые нужно вырезать
    tasks.splice(index, 1);

    // Добавляем задачу в хранилице браузера localStorage
    saveToLocalStorage()

    // Удаляем задачу из разметки
    pareNode.remove();

    checkEmptyList();

    /// Проверка

    // if(tasksList.children.length === 1){
    //     emptyList.classList.remove('none')
    // }
}

function doneTask(event){
    // Проверяем что клик был по кнопке "задача выполнена"
    // т.к. в разметки у кнопки есть атрибту data-action="done"

    if(event.target.dataset.action !== 'done') return 
        const pareNode = event.target.closest('.list-group-item'); // Находим родительски тег <li></li></li>
       
       const id = Number(pareNode.id); // Получаем id задачи

       // Затем нам необходимо найти эту задачу в массиве задач
       // Для поиска используем метод find
       // Метод find() - возвращает найденный элемент
       // Метод find() - возвращает ссылку на этот объект

       const task = tasks.find(function(task){
            if(task.id === id){
                return true
            }
       })
        task.done = !task.done

        // Добавляем задачу в хранилице браузера localStorage
        saveToLocalStorage()
       
        const taskTitle = pareNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done')
    
    
}

function checkEmptyList(){
    // Если в массиве tasks нет элементов(length = 0) -> тогда отображаем блок на странице
    
    if(tasks.length === 0){
        //Формируем разметку и ДОБАВЛЯЕМ в список
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                <div class="empty-list__title">Список дел пуст</div>
            </li>`

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }

    if(tasks.length > 0){
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks)); // При вызове это функции происходи сохранение массива tasks в localStorage
}

function renderTask(task){
    // Формируем CSS класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title"

    /// Формируе разметку для каждой задачи

    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`;


    /// Добавляем задачу на страницу
    /// insertAdjacentHTML - 1-й параметр - Куда хотим добавить, 2-й параметр - часть разметки которую хотим отобразить 
  
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
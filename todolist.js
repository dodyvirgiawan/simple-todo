const currentUser = JSON.parse(localStorage.getItem('userStorage'));

const username = document.getElementsByClassName('user-name')

for(let i = 0; i < username.length; i++) {
    username[i].innerHTML = currentUser[0].name
}


const toDoList = {
    1: {
        taskName: 'Go shopping',
        taskDesc: 'Lorem ipsum dolor sir amet',
        priority: 'High'
    },
    2: {
        taskName: 'Travel',
        taskDesc: 'Lorem ipsum dolor sir amet',
        priority: 'Medium'
    },
    3: {
        taskName: 'Go play basketball',
        taskDesc: 'Lorem ipsum dolor sir amet',
        priority: 'Low'
    }
}

function addToDoList() {

    renderToDoList()
    return toDoList
}

function deleteToDoList() {

    renderToDoList()
    return toDoList
}

function renderToDoList() {

}

renderToDoList()
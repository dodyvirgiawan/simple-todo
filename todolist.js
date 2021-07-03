const currentUser = JSON.parse(localStorage.getItem('userStorage'));

const username = document.getElementsByClassName('user-name')

for(let i = 0; i < username.length; i++) {
    username[i].innerHTML = currentUser[0].name
}



const toDoList = {}

function renderToDoList() {
    const toDoContainer = document.getElementById('to-do-list-container')
    toDoContainer.innerHTML = ''

    if(Object.keys(toDoList).length === 0) {
        toDoContainer.innerHTML = '<p class="alert alert-danger">You dont have any to-do-list. Start adding one!</p>'
    } else {

        const table = document.createElement('table')
        table.setAttribute('class','table')
        table.setAttribute('id','to-do-table')
        table.setAttribute('stlyle','font-size: 0.8rem;')
        toDoContainer.append(table)
        
        const newTable = document.getElementById('to-do-table')
        const thead = document.createElement('thead')
        const tbody = document.createElement('tbody')
        tbody.setAttribute('id','tbody-to-do')

        thead.innerHTML = '<tr><th scope="col">Task Name</th><th scope="col">Priority</th><th scope="col">Deadline</th><th scope="col">Action</th></tr>'

        newTable.append(thead)
        newTable.append(tbody)

        const bodyTable = document.getElementById('tbody-to-do')

        for(let id in toDoList) {
            let buttonStyle = ''
            if(toDoList[id].priority === 'High') {
                buttonStyle = 'btn-danger'
            } else if(toDoList[id].priority === 'Medium') {
                buttonStyle = 'btn-warning'
            } else {
                buttonStyle = 'btn-success'
            }

            const trTable = document.createElement('tr')

            trTable.innerHTML = `<tr>
                <td>${toDoList[id].taskName}</td>
                <td>
                    <button type="button" class="btn ${buttonStyle} my-btn">${toDoList[id].priority}</button>
                </td>
                <td>${toDoList[id].deadline}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm my-btn" onclick="editToDoList(${id})">Edit</button>
                    <button type="button" class="btn btn-danger btn-sm my-btn" onclick="deleteToDoList(${id})">Delete</button>
                </td>
            </tr>`

            bodyTable.appendChild(trTable)
        }
    }
    console.log(toDoList)
    return toDoList
}


function addToDoList() {
    
    const taskName = document.getElementById('task-name')
    const taskDescription = document.getElementById('task-desc')
    const taskPrio = document.getElementById('task-prio')
    const taskDeadline = document.getElementById('task-deadline').value // 2021-07-03

    if(taskName.value === '' || taskDescription.value === '' || taskPrio.value === '' || taskDeadline === '') {
        return alert('Please fill in all the form')
    }

    const months = {
        01: 'Jan',
        02: 'Feb',
        03: 'Mar',
        04: 'Apr',
        05: 'May',
        06: 'June',
        07: 'July',
        08: 'Aug',
        09: 'Sept',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec',
    }


    let date = taskDeadline.split('-') // ["2021","07","03"]

    let deadlineString = `${date[2]} ${months[Number(date[1])]}`

    // ID starts from 1
    let latestToDoListID = 0 
    if(Object.keys(toDoList).length !== 0) latestToDoListID = Object.keys(toDoList).length

    toDoList[latestToDoListID+1] = {}
    toDoList[latestToDoListID+1].taskName = taskName.value
    toDoList[latestToDoListID+1].priority = taskPrio.value
    toDoList[latestToDoListID+1].deadline = deadlineString
    toDoList[latestToDoListID+1].description = taskDescription.value

    // Reset
    taskName.value = ''
    taskPrio.value = ''
    taskDescription.value = ''


    renderToDoList()
    return toDoList
}

function deleteToDoList(id) {
    delete toDoList[id]
    renderToDoList()
    return toDoList
}

function editToDoList() {
    

    return toDoList
}

renderToDoList()
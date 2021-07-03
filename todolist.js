const currentUser = JSON.parse(localStorage.getItem('userStorage'));

const username = document.getElementsByClassName('user-name')

for(let i = 0; i < username.length; i++) {
    username[i].innerHTML = currentUser[0].name
}

const toDoList = {}
const priorityStatus = {
    High: 0,
    Medium: 0,
    Low: 0
} 

function renderToDoList() {
    const toDoContainer = document.getElementById('to-do-list-container')
    toDoContainer.innerHTML = ''
    
    
    if(Object.keys(toDoList).length === 0) {
        toDoContainer.removeAttribute('style') // Remove border
        toDoContainer.innerHTML = '<p class="alert alert-warning">You dont have any to-do-list. Start adding one!</p>'
    } else {
        toDoContainer.setAttribute('style','border: 1px solid rgb(226,226,226)')

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
            let buttonType = getButtonTypeByPriority(toDoList[id].priority)
            let dateString = dateToString(toDoList[id].deadline,'not-in-modal')

            const trTable = document.createElement('tr')

            trTable.innerHTML = `<tr>
                <td><button type="button" class="btn btn-outline-primary" onclick="showToDoListModal(${id})">${toDoList[id].taskName}</button></td>
                <td>
                    <button type="button" class="btn ${buttonType} my-btn">${toDoList[id].priority}</button>
                </td>
                <td>${dateString}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm my-btn" onclick="editToDoList(${id})">Edit</button>
                    <button type="button" class="btn btn-danger btn-sm my-btn" onclick="deleteToDoList(${id})">Delete</button>
                </td>
            </tr>`

            bodyTable.appendChild(trTable)
        }
    }

    renderAllToDoModal() // Render modal lagi
    renderStatistics() // Update statistics

    return toDoList
}

function renderStatistics() {
    const taskStatistics = document.getElementById('task-statistics')
    if(Object.keys(toDoList).length === 0) {
        taskStatistics.innerHTML = '<p class="alert alert-warning" style="width: 80%; margin: auto;">Stats not available, start adding to-do-list!</p><br>'
    } else {
        taskStatistics.innerHTML = `<button type="button" class="btn btn-danger">
            <h4>High Priority Tasks</h4>
            <h5><span id="high-prio-task">${priorityStatus.High}</span></h5>
        </button><br><br>
        <button type="button" class="btn btn-warning">
            <h4>Medium Priority Tasks</h4>
            <h5><span id="med-prio-task">${priorityStatus.Medium}</span></h5>
        </button><br><br>
        <button type="button" class="btn btn-success">
            <h4>Low Priority Tasks</h4>
            <h5><span id="low-prio-task">${priorityStatus.Low}</span></h5>
        </button><br><br>`
    }
}

function renderAllToDoModal() {

    const kumpulanModal = document.getElementById('to-do-list-modal')

    kumpulanModal.innerHTML = '' // Reset

    for(let id in toDoList) {
        let deadlineString = dateToString(toDoList[id].deadline,'in-modal')
        let deadlineButtonType = getButtonTypeByPriority(toDoList[id].priority)

        const newModal = document.createElement('div')
        newModal.setAttribute('class','modal fade')
        newModal.setAttribute('id',`modal-${id}`)
        newModal.setAttribute('tabIndex',`-1`)
        newModal.setAttribute('role',`dialog`)
        newModal.setAttribute('role',`dialog`)
        newModal.setAttribute('aria-labelledby',`modal-label-${id}`)
        newModal.setAttribute('aria-hidden',`true`)

        const divContent = `<div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modal-label-${id}">Todos</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <h5>Task name</h5>
                    <div class="alert alert-info" role="alert">
                        <h6>${toDoList[id].taskName}</h6>
                    </div><hr>

                    <h5>Task description</h5>
                    <div class="alert alert-info" role="alert">
                        <h6>${toDoList[id].description}</h6>
                    </div><hr>

                    <h5>Task deadline</h5>
                    <div class="alert alert-warning" role="alert">
                        <h6>${deadlineString}</h6>
                    </div><hr>

                    <h5>Task priority</h5>
                    <div class="alert alert-warning" role="alert">
                        <button type="button" class="btn ${deadlineButtonType} btn-sm my-btn">${toDoList[id].priority}</button>
                    </div><hr>
                    
                    <button type="button" class="btn btn-primary btn-sm my-btn">Edit this todos</button>
                    <button type="button" class="btn btn-danger btn-sm my-btn" onclick="deleteToDoList(${id})">Delete this todos</button>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>`

        newModal.innerHTML = divContent
        kumpulanModal.appendChild(newModal)
    }


}

function showToDoListModal(id) {
    return $(`#modal-${id}`).modal('show');
}

// Place: 'modal','not-modal'
// Input: 2021-07-03
// Output: 3 Jul (not-modal)
// Output: 3 July 2021 (modal)
function dateToString(str, place) {
    const monthsNotInModal = {
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
    const monthsInModal = {
        01: 'January',
        02: 'February',
        03: 'March',
        04: 'April',
        05: 'May',
        06: 'June',
        07: 'July',
        08: 'August',
        09: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    }

    let date = str.split('-') // ["2021","07","03"]

    if(place === 'not-in-modal') return `${date[2]} ${monthsNotInModal[Number(date[1])]}`
    else if(place === 'in-modal') return `${date[2]} ${monthsInModal[Number(date[1])]} ${date[0]}`
}

function getButtonTypeByPriority(str) {
    if(str === 'High') {
        return 'btn-danger'
    } else if(str === 'Medium') {
        return 'btn-warning'
    } else {
        return 'btn-success'
    }
}

function addToDoList() {
    
    const taskName = document.getElementById('task-name')
    const taskDescription = document.getElementById('task-desc')
    const taskPrio = document.getElementById('task-prio')
    const taskDeadline = document.getElementById('task-deadline')

    if(!taskName.value || !taskDescription.value || !taskPrio.value || taskDeadline === undefined) {
        return $('#errorModal').modal('show');
    }

    // ID starts from 1
    let latestToDoListID = 0 
    if(Object.keys(toDoList).length !== 0) latestToDoListID = Object.keys(toDoList).length

    toDoList[latestToDoListID+1] = {}
    toDoList[latestToDoListID+1].taskName = taskName.value
    toDoList[latestToDoListID+1].priority = taskPrio.value
    toDoList[latestToDoListID+1].deadline = taskDeadline.value
    toDoList[latestToDoListID+1].description = taskDescription.value

    // Add to frequency status
    priorityStatus[taskPrio.value]++

    // Reset DOM
    taskName.value = ''
    taskPrio.value = ''
    taskDescription.value = ''

    renderToDoList()
    return toDoList
}

function deleteToDoList(id) {

    // Update frequency status
    priorityStatus[toDoList[id].priority]--

    // Delete from todolist
    delete toDoList[id]

    // Hide modal
    $(`#modal-${id}`).modal('hide')

    // Render
    renderToDoList()
    return toDoList
}

function editToDoList() {


    return toDoList
}

renderToDoList()

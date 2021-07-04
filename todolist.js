/**
 *  Todos v1.0
 *  by Dody Virgiawan
 *  (Repo: https://github.com/dodyvirgiawan/simple-todo)
 * 
 */


// Get local storage of user name from index.html
const currentUser = JSON.parse(localStorage.getItem('userStorage'));

// Render all elements that has class user-name to update with current input of user
const username = document.getElementsByClassName('user-name')
for(let i = 0; i < username.length; i++) {
    username[i].innerHTML = currentUser[0].name
}

// Main variables that will store to do lists
const toDoList = {}
const priorityStatus = {
    High: 0,
    Medium: 0,
    Low: 0
} 

/**
 * Main function to render the page. Function will call another helper function
 *  1. Render to do list modal => renderAllToDoModal()
 *  2. Render edit to do list modal => renderAllEditToDoModal()
 *  3. Render statistics => renderStatistics()
 */
function renderToDoList() {
    // Reset
    const toDoContainer = document.getElementById('to-do-list-container')
    toDoContainer.innerHTML = ''
    
    // Validate
    if(Object.keys(toDoList).length === 0) {
        toDoContainer.removeAttribute('style') // Remove border
        toDoContainer.innerHTML = '<p class="alert alert-warning">You dont have any to-do-list. Start adding one!</p>'
    } else {
        toDoContainer.setAttribute('style','border: 1px solid rgb(226,226,226)') /// Add border

        // Add table
        const table = document.createElement('table')
        table.setAttribute('class','table')
        table.setAttribute('id','to-do-table')
        table.setAttribute('stlyle','font-size: 0.8rem;')
        toDoContainer.append(table)
        
        // Add table header/head
        const newTable = document.getElementById('to-do-table')
        const thead = document.createElement('thead')
        const tbody = document.createElement('tbody')
        tbody.setAttribute('id','tbody-to-do')
        thead.innerHTML = '<tr><th scope="col">Task Name</th><th scope="col">Priority</th><th scope="col">Deadline</th><th scope="col">Action</th></tr>'
        newTable.append(thead)
        newTable.append(tbody)

        // Render table body
        const bodyTable = document.getElementById('tbody-to-do')

        for(let id in toDoList) {
            let buttonType = getButtonTypeByPriority(toDoList[id].priority) // Determine button type based on priority
            let dateString = dateToString(toDoList[id].deadline,'not-in-modal') // Convert to user-friendly dates

            const trTable = document.createElement('tr')

            trTable.innerHTML = `<tr>
                <td><button type="button" class="btn btn-outline-primary" onclick="showToDoListModal(${id})">${toDoList[id].taskName}</button></td>
                <td>
                    <button type="button" class="btn ${buttonType} my-btn">${toDoList[id].priority}</button>
                </td>
                <td>${dateString}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm my-btn" onclick="showEditToDoListModal(${id})">Edit</button>
                    <button type="button" class="btn btn-danger btn-sm my-btn" onclick="deleteToDoList(${id})">Delete</button>
                </td>
            </tr>`

            bodyTable.appendChild(trTable)
        }
    }

    renderAllToDoModal() // Render modal 
    renderAllEditToDoModal() // Render edit to do modal
    renderStatistics() // Update statistics

    return toDoList
}

// Render statistics section
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

    return priorityStatus
}

// Render edit to do modal
function renderAllEditToDoModal() {
    const kumpulanEditModal = document.getElementById('edit-to-do-modal')

    kumpulanEditModal.innerHTML = '' //Reset

    for(let id in toDoList) {
        const newEditModal = document.createElement('div')
        newEditModal.setAttribute('class','modal fade')
        newEditModal.setAttribute('id',`edit-modal-${id}`)
        newEditModal.setAttribute('tabIndex',`-1`)
        newEditModal.setAttribute('role',`dialog`)
        newEditModal.setAttribute('role',`dialog`)
        newEditModal.setAttribute('aria-labelledby',`edit-modal-label-${id}`)
        newEditModal.setAttribute('aria-hidden',`true`)

        const editDivContent = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modal-label-${id}">Edit Todos</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <h5>Edit Task name</h5>
                    <div class="input-group mb-3">
                        <input type="text" id="edit-task-name-${id}" value="${toDoList[id].taskName}">
                    </div><hr>

                    <h5>Edit Task description</h5>
                    <div class="input-group mb-3">
                        <input type="text" id="edit-task-desc-${id}" value="${toDoList[id].description}">
                    </div><hr>

                    <h5>Edit Task deadline</h5>
                    <div class="input-group mb-3">
                        <input type="date" id="edit-task-deadline-${id}" value="${toDoList[id].deadline}">
                    </div><hr>

                    <h5>Edit Task priority</h5>
                    <div class="input-group mb-3">
                        <select class="form-select form-select-sm" id="edit-task-prio-${id}" value="${toDoList[id].priority}">
                            <option value="High" id="sel-High">High</option>
                            <option value="Medium" id="sel-Medium">Medium</option>
                            <option value="Low" id="sel-Low">Low</option>
                        </select>
                    </div><hr>

                    <div id="edit-error-${id}">

                    </div>
                    
                    <button type="button" class="btn btn-primary btn-sm my-btn" class="close" data-dismiss="modal" onclick="updateToDoList(${id})">Save Changes</button>
                    <button type="button" class="btn btn-danger btn-sm my-btn" onclick="showToDoListModal(${id})">Cancel</button>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal"">Close</button>
                </div>
            </div>
        </div>
        `

        newEditModal.innerHTML = editDivContent        
        kumpulanEditModal.appendChild(newEditModal)

        // Update the selected option in task priority dropdown list
        const selectedPriority = document.getElementById(`sel-${toDoList[id].priority}`)
        selectedPriority.setAttribute('selected','')
    }

    return toDoList
}


// Render view to do list modal
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

        const divContent = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modal-label-${id}">View Todos</h5>
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
                    
                    <button type="button" class="btn btn-primary btn-sm my-btn" onclick="showEditToDoListModal(${id})">Edit this todos</button>
                    <button type="button" class="btn btn-danger btn-sm my-btn" onclick="deleteToDoList(${id})">Delete this todos</button>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal"">Close</button>
                </div>
            </div>
        </div>
        `

        newModal.innerHTML = divContent
        kumpulanModal.appendChild(newModal)
    }

    return toDoList
}

// Update to do list, gets called when user click edit button
function updateToDoList(id) {
    const editedTaskName = document.getElementById(`edit-task-name-${id}`)
    const editedTaskDesc = document.getElementById(`edit-task-desc-${id}`)
    const editedTaskPrio = document.getElementById(`edit-task-prio-${id}`)
    const editedTaskDeadline = document.getElementById(`edit-task-deadline-${id}`)

    if(!editedTaskName.value || !editedTaskDesc.value || !editedTaskPrio.value || editedTaskDeadline === undefined) {
        const errorBox = document.getElementById(`edit-error-${id}`)
        errorBox.setAttribute('class','alert alert-danger')
        errorBox.setAttribute('role','alert')
        errorBox.innerHTML = 'Please fill in all the form before saving changes.'
        return
    }

    // Update
    priorityStatus[toDoList[id].priority]-- // Update current value (before edited)

    toDoList[id].taskName = editedTaskName.value
    toDoList[id].priority = editedTaskPrio.value
    toDoList[id].deadline = editedTaskDeadline.value
    toDoList[id].description = editedTaskDesc.value

    priorityStatus[editedTaskPrio.value]++ // Update edited value 

    // Render
    renderToDoList() 

    // Hide the edit modal
    $(`#edit-modal-${id}`).modal('hide') 

    // To fix: https://stackoverflow.com/questions/22056147/bootstrap-modal-backdrop-remaining
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();

    // Return to the view modal
    showToDoListModal(id)

    return toDoList
}

// Show the view modal
function showToDoListModal(id) {
    $(`#edit-modal-${id}`).modal('hide'); // make sure to not overlap
    return $(`#modal-${id}`).modal('show');
}

// Show the edit modal
function showEditToDoListModal(id) {
    $(`#modal-${id}`).modal('hide'); // make sure not overlap
    return $(`#edit-modal-${id}`).modal('show');
}

// Gets called when users click Add Todos
function addToDoList() {
    
    const taskName = document.getElementById('task-name')
    const taskDescription = document.getElementById('task-desc')
    const taskPrio = document.getElementById('task-prio')
    const taskDeadline = document.getElementById('task-deadline')

    if(!taskName.value || !taskDescription.value || !taskPrio.value || taskDeadline === undefined) {
        return $('#errorModal').modal('show'); 
    }

    let latestToDoListID = 0 
    if(Object.keys(toDoList).length !== 0) latestToDoListID = Object.keys(toDoList).length // Check latest ID if user has already inputted to do list

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

// Remove to do list
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

// Input: 2021-07-03
// Output: 3 Jul (if place = not-modal)
// Output: 3 July 2021 (if place = modal)
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

    let date = str.split('-') 

    if(place === 'not-in-modal') return `${date[2]} ${monthsNotInModal[Number(date[1])]}`
    else if(place === 'in-modal') return `${date[2]} ${monthsInModal[Number(date[1])]} ${date[0]}`
}

// Determine button type class based on bootstrap button classes and the to do list priority
function getButtonTypeByPriority(str) {
    if(str === 'High') {
        return 'btn-danger'
    } else if(str === 'Medium') {
        return 'btn-warning'
    } else {
        return 'btn-success'
    }
}

// Invoke main function when user first open the browser
renderToDoList()

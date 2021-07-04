/**
 *  Todos v1.0
 *  by Dody Virgiawan
 *  (Repo: https://github.com/dodyvirgiawan/simple-todo)
 * 
 */

const userDatabase = []

const nameInput = document.getElementById('name-input')
const proceedButton = document.getElementById('proceed-button')

proceedButton.addEventListener('click', function () {
    if(nameInput.value === '') {
        const errorMessage = document.getElementById('error-msg')
        errorMessage.setAttribute('class','alert alert-danger text-center')
        errorMessage.setAttribute('role','alert')
        errorMessage.innerHTML = 'Please input your name before proceeding!'
    } else {
        let user = {name: nameInput.value}
        userDatabase.push(user)
        localStorage.setItem('userStorage', JSON.stringify(userDatabase))
        window.location.replace('todolist.html')
    }
})
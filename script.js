// ****** Helper functions ******

/**
 * 
 * @param {string} textZone form text input. Cannot be empty
 */
function verifyEntry (textZone) {
    if (textZone.value === "") {
        throw new Error(`Please enter content`) 
    }
}

/**
 * 
 * @param {string} key 
 * @param {string} element 
 */
function setInLocalStorage (key, element) {
    let elementJSON = JSON.stringify(element)
    window.localStorage.setItem(`${key}`, elementJSON)

}

/**
 * 
 * @param {string} key 
 * @returns 
 */
function getFromLocalStorage (key) {
    let storage = window.localStorage.getItem(`${key}`)
    if (storage !== undefined ) {
        return JSON.parse(storage)
    }
    return null
}


// ****** Main functions ******

/**
 * 
 * @param {string} zoneFrom Tasks, Done or Deleted
 * @param {string} zoneTo idem
 * @param {number} index to target the task
 */
function moveTasks (zoneFrom, zoneTo, index) {
    let zoneFromArray = getFromLocalStorage(zoneFrom)
    let zoneToArray = getFromLocalStorage(zoneTo)

    let movedItem = zoneFromArray.splice(index, 1)
    zoneToArray.push(movedItem)
    setInLocalStorage(zoneTo, zoneToArray)
    setInLocalStorage(zoneFrom, zoneFromArray)

    displayTasks()
}

/**
 * 
 * @param {string} reportedTask 
 * @param {string} currentZone 
 * @param {number} taskIndex 
 */
function addButtons (reportedTask, currentZone, taskIndex) {
    let buttonImgDone = document.createElement("button")
    buttonImgDone.className = "taskiconToDone"
    buttonImgDone.innerHTML = '<img src="Icons/check.png" alt="done">'

    buttonImgDone.addEventListener("click", (e) => {
        e.preventDefault()
        moveTasks(currentZone, "Done" , taskIndex)

    })
    reportedTask.append(buttonImgDone)

    let buttonImgDelete = document.createElement("button")
    buttonImgDelete.className = "taskiconToDeleted"
    buttonImgDelete.innerHTML = '<img src="Icons/x-mark.png" alt="delete">'  

    buttonImgDelete.addEventListener("click", (e) => {
        e.preventDefault()
        moveTasks(currentZone, "Deleted" , taskIndex)

    })
    reportedTask.append(buttonImgDelete)

    let buttonImgUp = document.createElement("button")
    buttonImgUp.className = "taskiconToTODO"
    buttonImgUp.innerHTML = '<img src="Icons/up-arrow2.png" alt="up to tasks">'  

    buttonImgUp.addEventListener("click", (e) => {
        e.preventDefault()
        moveTasks(currentZone, "TODO" , taskIndex)

    })
    reportedTask.append(buttonImgUp)

}

// Display Function
function displayTasks() {
    for (let zoneName of ["TODO", "Done", "Deleted"]){
        document.querySelector(`.taskZone${zoneName}`).innerHTML=""
        getFromLocalStorage(zoneName).forEach((task, taskIndex) => {
            const taskElement = document.createElement("p");
            taskElement.textContent = task;
            
            document.querySelector(`.taskZone${zoneName}`).appendChild(taskElement);
            addButtons(taskElement, zoneName, taskIndex)
        })
    }
}


// ****** Main ******

let submitButtonElement = document.getElementById("submitButton")
let newTaskElement = document.getElementById("newtaskinput")


submitButtonElement.addEventListener("click", (e) => {
    verifyEntry(newTaskElement)
    e.preventDefault()

    let todoList = getFromLocalStorage("TODO")
    todoList.push(newTaskElement.value)
    newTaskElement.value = ""

    setInLocalStorage("TODO", todoList)
    
    displayTasks()
})

// initialisation of local storage
for (let zoneName of ["TODO", "Done", "Deleted"]){
    if (getFromLocalStorage(zoneName) === null) {
        setInLocalStorage(zoneName, [])
    }
}
displayTasks()

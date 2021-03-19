let db  
// indexedDB PORTION
//create a db called budget and assigning a version
const request = indexedDB.open("budget", 1)

//create your object stores, where we will store our data
request.onupgradeneeded = function (event) {
  const db = event.target.result
  db.CreateobjectStore("pending", { autoIncrement: true }) 

}

  //create an index, a quick reference to find info based on the field name specified 
  //                                                    keyPath: "name"??
  const objectStore = db.createObjectStore("pending", { autoIncrement: true }) 
  //create an index called 'timestamp' that is going to let us query by 'timestamp'
  objectStore.createIndex("amount", "amount")
  objectStore.createIndex("addsub", "addsub")




request.onsuccess = (event) => {
  const db = event.target.result

  if (navigator.onLine) {
    checkDatabase()
  }

function checkDatabase() {

  const transaction = db.transaction(["pending"], "readwrite")

  const store = transaction.objectStore("pending")

  const getAll = store.getAll()

  getAll.onsuccess = function() {
    if (getAll.result.length > 0 ) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application,json, text/plain, */*",
          "Content Type": "application,json",
        }
      })
        .then((response) => response.json())
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite")

          const store = transaction.objectStore("pending")

          store.clear()

        })
    }
  }
}

window.addEventListener("online", checkDatabase)



//   const transaction = db.transaction (["budget", "readwrite"])
//   const budgetStore = transaction.objectStore("budget")
//   const statusIndex = budgetStore.index("statusIndex") //WTF IS GOING ON HERE

//   budgetStore.add({listID: "", status: ""})

//   //cursor - do i need?
//   const getCursorRequest = budgetStore.openCursor()

//   //cursors are primarily used for updating.  do i need this to push or pull from cached array?  or maybe to pull cursor.value to find transactions?
//   getCursorRequest.onsuccess = e => {

//     //gives us access to each of the objects in turn.  acts as an iterator 
//     const cursor = e.target.result

//     //decides whether or not there are still objects left to loop thru
//     if (cursor) { 
//       console.log(cursor.value)
//       cursor.continue()
//     } else {
//       console.log("No transactions left!")
//     }
//   }



//   const getRequestAdd = statusIndex.getAll("addition")
//   getRequestAdd.onsuccess = () => {
//     console.log(getRequestAdd.result)
//   }
//   const getRequestSub = statusIndex.getAll("subtraction")
//   getRequestSub.onsuccess = () => {
//     console.log(getRequestSub.result)
//   }
// }
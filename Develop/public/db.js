let db  
//create a db called budget and assigning a version
const request = indexedDB.open("budget", 1)

//create your object stores, where we will store our data
request.onupgradeneeded = function (event) {
  const db = event.target.result
  db.CreateobjectStore("pending", { autoIncrement: true }) 
}

request.onsuccess = function (event) {
  const db = event.target.result

  if (navigator.onLine) {
    checkDatabase()
  }
}

request.onerror = function(event) {
  console.log("Woops! " + event.target.errorCode);
};

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

function saveRecord(record) {
  const transaction = db.transaction(['pending'], 'readwrite')

  const store = transaction.objectStore('pending')

  store.add(record)
}

window.addEventListener("online", checkDatabase)
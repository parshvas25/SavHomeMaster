/*
This javascript file will manage
*/

// every key up not entering loaded
function Filter(){
  var input  = document.getElementById("myInput");
  var filter = input.value.toUpperCase();
  var table = document.getElementById("filterTable");
  var tr = table.getElementsByTagName("tr");
  var td, textValue;

  // loop through tr and hide ones which do not match query
  for(var i = 0; i < tr.length; i++){
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function readFromDB(){
  // you want to call this everytime the page is reloaded
  const list = document.getElementById('job-list');
  keys = [];
  // read from database and for each item read make a new table row to insert
  const dbRef = firebase.database().ref();
  dbRef.once('value', function(snap){
    snap.forEach(function(item){
      var itemVal = item.val();
      keys.push(itemVal);
    });
    for(var i in keys){
      const obj = keys[i];
      Object.keys(obj).forEach((name, index) => {
        // Now I have the name, department, and job number
        const jobNumArr = obj[name].job_numbers;
        const department = obj[name].department;
        const jobNumArrLength = (obj[name].job_numbers).length;

        for(var i = 0; i < jobNumArrLength; i++){
          // Now each time we want to create a new table row element and load the items
          const row = document.createElement('tr');
          row.innerHTML = `
          <td>${jobNumArr[i]}</td>
          <td>${name}</td>
          <td>${department}</td>
          <td><a href ="#" class = "delete">X<a></td>
          `;
          list.appendChild(row);
        }
        //console.log(`${name}: ${obj[name].job_numbers}, department: ${obj[name].department}`);
      })
    }
  });
}

class Job {
  constructor(title, author, jobNum){
    this.title = title;
    this.author = author;
    this.jobNum = jobNum;
  }
}

class UI {
  addJobToList(job) {
    const list = document.getElementById('job-list');
    const ui = new UI();
    var keys = [];
    // read the array then update
    const dbRef = firebase.database().ref().child(job.title).child(job.author).child('job_numbers');
    // Now we have the reference to the jobs array of the individual
    dbRef.once('value', function(snap){
      snap.forEach(function(item){
        var itemVal = item.val();
        keys.push(itemVal);
      });

      // CHECK IF JOB NUMBER LIMIT CROSSED
      if(keys.length == 10){
        ui.showAlert(`Job limit exceeded for ${job.author}, Please delete a previous job`, 'error')
        return;
      }
      if(keys.includes(job.jobNum)){
        ui.showAlert('Job Already Assigned!', 'error');
        return;
      }

      keys.push(job.jobNum); // append the new job number
      // Update the keys including the new one
      var depRef = firebase.database().ref(job.title);
      depRef.child(job.author).set({
        job_numbers:keys,
        department:job.title,
      })
      .then(function(){
        // Create a new Table Row
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${job.jobNum}</td>
        <td>${job.author}</td>
        <td>${job.title}</td>
        <td><a href ="#" class = "delete">X<a></td>
        `;
        list.appendChild(row);
        ui.showAlert('Job Added to be Tracked!', 'success')
      });
    });
  }

  showAlert(msg, className) {
    // create a div
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    // ad text node
    div.appendChild(document.createTextNode(msg));
    // get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#job-form');
    container.insertBefore(div, form); // want to put the div before the parent form

    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 5000);
  }

  deleteJob(target) {
    // remove a job for an employee from DB
    // if the employee has no more jobs left then remove the employee as well
    const nodeLis = target.parentElement.parentElement.childNodes;
    const jobNumber = nodeLis[1].textContent;
    const name = nodeLis[3].textContent;
    const department = nodeLis[5].textContent
    // Reference
    const dbRef = firebase.database().ref().child(department).child(name).child('job_numbers');
    var keys = [];

    // Remove the job number from the array
    dbRef.once('value', function(snap){
      snap.forEach(function(item){
        var itemVal = item.val();
        keys.push(itemVal);
      });
      // If the array is empty delete the entire employee
      if(keys.length == 1){
        // THIS IS TO DELETE THE ENTIRE EMPLOYEE
        const dbRef2 = firebase.database().ref().child(department).child(name);
        dbRef2.remove()
        .then(function(){
          console.log('Remove successfull!');
        })
        .catch(function(error) {
        console.log("Remove failed: " + error.message)
        });

        // remove the item from the page as well
        if(target.className === 'delete'){
          target.parentElement.parentElement.remove();
        }
        return;
      }
      // Remove job number from the array
      var index = keys.indexOf(jobNumber);
      keys.splice(index, 1);

      // Write/Update the new array
      var depRef = firebase.database().ref(department);
      depRef.child(name).set({
        job_numbers:keys,
        department: department,
      })
      .then(function(){
        // Delete the Table Row
        if(target.className === 'delete'){
          target.parentElement.parentElement.remove();
        }
      });
    });
  }
  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('employee').value = '';
    document.getElementById('job-number').value = '';
  }
}

// Create event listers
document.getElementById('job-form').addEventListener('submit', function(e){
  // get all the field values
  const title = document.getElementById('title').value;
  const employee = document.getElementById('employee').value;
  const job = document.getElementById('job-number').value;

  const new_job = new Job(title, employee, job); // Create a new job

  // Instantiate a UI object
  const ui = new UI();
  // check for empty insertions and provide some change
  if(title === '' || employee === '' || job === ''){
    // error alert
    ui.showAlert('Fill in All Fields!', 'error');
  } else {
    // add the job to list
    ui.addJobToList(new_job);
    // show showAlert
    ui.clearFields();
  }
  e.preventDefault();
});

// event lister for delete
document.getElementById('job-list').addEventListener('click', function(e){
  // Instantiate a UI object
  const ui = new UI();
  // call delete job
  ui.deleteJob(e.target);
  // show an alert
  ui.showAlert('Job sucsessfully removed!', 'success');
  // prevent default behaviour
  e.preventDefault();
})

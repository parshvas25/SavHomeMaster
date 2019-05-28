setInterval(refresh, 300000);
function refresh(){
  document.location.reload();
}

var scrolldelay;
function pageScroll() {
    window.scrollBy(0,1); // horizontal and vertical scroll increments
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        setTimeout('PageUp()',2000);
    }
}

function PageUp() {
    clearInterval(scrolldelay)
    window.scrollTo(0, 0);
    scrolldelay = setInterval('pageScroll()',100);
}
scrolldelay = setInterval('pageScroll()',200); // scrolls every 200 milliseconds

function readFromDB(){
  // you want to call this everytime the page is reloaded
  const list = document.getElementById('job-list');
  keys = [];
  // read from database and for each item read make a new table row to insert
  const dbRef = firebase.database().ref();  // NEED TO READ ONLY V1504
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
          if(department == 'Telecab'){
            // Now each time we want to create a new table row element and load the items
            const row = document.createElement('tr');
            row.innerHTML = `
            <td class ="tdEl">${jobNumArr[i]}</td>
            <td class ="tdEl">${name}</td>
            `;
            list.appendChild(row);
          }
        }
        //console.log(`${name}: ${obj[name].job_numbers}, department: ${obj[name].department}`);
      })
    }
  });
}

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

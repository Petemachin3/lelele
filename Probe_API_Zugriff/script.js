// Function to change the content of t2
function modifyText() {
  var t2 = document.getElementById("t2");
  if (t2.firstChild.nodeValue == "three") {
    t2.firstChild.nodeValue = "two";
  } else {
    t2.firstChild.nodeValue = typeof(zahl);
  }
}

async function apiabfrage() {
  var t3 = document.getElementById("t3");
  // const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const response = await fetch(url);
  const myJson = await response.json();
  console.log(JSON.stringify(myJson));
  var b;
  c = JSON.stringify(myJson);
  b = JSON.parse(c);

  printing(c);
}

async function postdata(url = '', data = {}, requesttype = ''){
  const response = await fetch(url, {
    method: requesttype, // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // cors, no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  const myJson = await response.json();
  console.log(JSON.stringify(myJson));
  apiabfrage();
}


function printing(content){
  t3.firstChild.nodeValue = content;
}

function test(type, link, bodydata){
  var requesttype = type;
  var data = bodydata;
  postdata(link, data, requesttype);
  // document.getElementById("inputdeleteitemid").value = "";
}

function testpardel(){
  var inputdeleteitemid = document.getElementById("inputdeleteitemid").value;
  // document.getElementById("inputdeleteitemid").value = "ID des zu löschenden Items eingeben";
  itemid = "/" + inputdeleteitemid;
  delurl = url + "/items" + itemid //, {"name": "Testerei"}
  test("DELETE", delurl);
}

function testparpos(){
  var inputpostitemdata = document.getElementById("inputpostitem").value;
  // document.getElementById("inputpostitem").value = "Name des Items eingeben";
  inputpostitemdata = {"name": inputpostitemdata}
  console.log(typeof(inputpostitemdata))
  posurl = url + "/items"
  test("POST", posurl, inputpostitemdata);
}

function testparput(){
  var inputdeleteitemid = document.getElementById("inputdeleteitemid").value;
  itemid = "/" + inputdeleteitemid;
  putitemdata = {"bought": bought.toString()}
  console.log(typeof(bought))
  puturl = url + "/items" + itemid;
  test("PUT", puturl, putitemdata);
}

function checken(){
   if (checkBox.checked == true){
     bought = true;
   }
   else {
     bought = false;
   }
   t2.firstChild.nodeValue = bought;
}

// add event listener to table
window.onload = function() {
  url = 'http://shopping-lists-api.herokuapp.com/api/v1/lists/5db025be2e4f8f0017e5c5b0';
  var deleterequest = document.getElementById("deleterequest");
  deleterequest.addEventListener("click", testpardel);

  var postrequest = document.getElementById("postrequest");
  postrequest.addEventListener("click", testparpos);
  //
  // var el = document.getElementById("outside");
  // el.addEventListener("click", modifyText);

  var getliste = document.getElementById("getliste");
  getliste.addEventListener("click", apiabfrage);
  //
  // var inputdeleteitemid = document.getElementById("inputdeleteitemid");
  // inputdeleteitemid.addEventListener("click", postdata(document.getElementById("inputdeleteitemid")))
  //

  var inputdelenter = document.getElementById("inputdeleteitemid");
  inputdelenter.addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
      testpardel();
    }
  });

  var inputposenter = document.getElementById("inputpostitem");
  inputposenter.addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
      testparpos();
    }
  });

  checkBox = document.getElementById("subscribeNews6");

  bought = false;



}

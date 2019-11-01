// Functions
function urlgenerator(newlistid){
  setboxcolor();
  listid = newlistid;
  url = urlshort + newlistid;
  allitemsdel();
  apiabfrage();
}

function setboxcolor(){
}

function modifyText() {
  var t2 = document.getElementById("t2");
  if (t2.firstChild.nodeValue == "three") {
    t2.firstChild.nodeValue = "two";
  } else {
    t2.firstChild.nodeValue = typeof(zahl);
  }
}

async function apiabfrage() {
  const response = await fetch(url);
  getJson = await response.json();
  c = JSON.stringify(getJson);

	allitemget(getJson);
}

async function postdata(url = '', data = {}, requesttype = ''){
  const response = await fetch(url, {
    method: requesttype, // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // cors, no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'a24fb077b67a5dedc043ac28afbea9c6',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  getJson = await response.json();
	console.log(JSON.stringify(getJson));

  allitemsdel();
  allitemget(getJson);
}


function printing(content){
  t3.firstChild.nodeValue = content;
}

async function getalllists(){
  var getallurl = urlshort.slice(0, urlshort.length - 1);
  console.log(getallurl);
  const response = await fetch(getallurl, {method: "GET", headers: {'Content-Type': 'application/json', 'Authorization': 'a24fb077b67a5dedc043ac28afbea9c6'}});
  getalllistsjson = await response.json();
  // console.log(getalllistsjson[0]._id);
  alllistsbox(getalllistsjson);
}

function testpardel(itemid){
  // var deleteitemid = document.getElementById("inputdeleteitemid").value;
  // document.getElementById("inputdeleteitemid").value = "ID des zu löschenden Items eingeben";
  // var itemid = "/" + inputdeleteitemid;
  delurl = url + "/items/" + itemid;
  postdata(delurl, {}, "DELETE");
}

function testparpos(){
  var inputpostitemdata = document.getElementById("inputpostitem").value;
  inputpostitemdata = {"name": inputpostitemdata};
  console.log(typeof(inputpostitemdata));
  posurl = url + "/items";
  postdata(posurl, inputpostitemdata, "POST");
  document.getElementById("inputpostitem").value = "";
}

function testparput(itemid){
  var itemnr = idnrdict[itemid];
  var putitemdata;
	getbought = getJson.items[itemnr].bought;
	console.log(typeof(getbought));
	if (getbought) {
		putitemdata = {"bought": "false"};
	}
	else {
		putitemdata = {"bought": "true"};
	}
  var puturl = url + "/items/" + itemid
  postdata(puturl, putitemdata, "PUT");
}

function bridgecreateaufruf(itemnr, jsoncontent){
	var itemname = jsoncontent.items[itemnr].name;
	// console.log(getJson.items.length);
	// console.log(itemnr);
	var itembought = jsoncontent.items[itemnr].bought;
	var itemid = jsoncontent.items[itemnr]._id;
  idnrdict[itemid] = itemnr;
	console.log(idnrdict[itemid]);
	// .items[itemnr].name;
	createaufruf(itembought, itemname, itemid, itemnr);
}


async function allitemget(jsoncontent){ // jsoncontent ist das Objekt einer Liste
  // console.log("Zeile 105");
  // console.log(jsoncontent);
	for (var i = 0; i < jsoncontent.items.length; i++){
    console.log("Zeile 108")
    console.log(jsoncontent.items.length)
		bridgecreateaufruf(i.toString(), jsoncontent);
	}
  var aktlistname = document.getElementsByClassName("aktlistname");
  for (var i = 0; i < aktlistname.length; i++){
    aktlistname[i].textContent =jsoncontent.name;
  }
}

function allitemsdel(){
  // var elements = document.getElementsByClassName("itemrows");
  //     while(elements.length > 0){
  //         elements[0].parentNode.removeChild(elements[0]);
      // }
  var node= document.getElementById("createreturn");
  node.querySelectorAll('*').forEach(n => n.remove());
}

function generischEventlistenercheck(itemid){
	var checkbox = document.getElementById("ch" + itemid);
	var checkboxvalue = checkbox.id;
	checkbox.addEventListener("click", function(){
			testparput(itemid);
	});
}

function generischEventlistenerdel(itemid){
	var deletebox = document.getElementById("de" + itemid);
	var deleteboxvalue = deletebox.id;
	deletebox.addEventListener("click", function(){
			var itemid = deleteboxvalue.slice(2, deleteboxvalue.length);
			testpardel(itemid);
	});
}

function createaufruf(bought, itemname = "", itemid, itemnr){
  var list = document.querySelector('#createreturn');
  newrow = document.createElement('tr');
    newrow.id = "row" + itemid;
    newrow.className = "itemrows";
		newcell1 = document.createElement('td');
			newbutput = document.createElement('input');
				newbutput.type = 'checkbox';
				newbutput.id = "ch" + itemid;
				newbutput.name = itemnr;
				newbutput.className = "checkButton";
				if (bought) {
					newbutput.checked = true;
				}
				else {
					newbutput.checked = false;
				}
				newbutputlab = document.createElement('label');
					newbutputlab.for = 'subscribeNews10';
				newbutput.appendChild(newbutputlab);
			newcell1.appendChild(newbutput);
		newrow.appendChild(newcell1);
		  newcell2 = document.createElement('td');
			   newcell2.textContent = itemname;
			      newcell2.className = "itemcontent";
		newrow.appendChild(newcell2);
		  newcell3 = document.createElement('td');
  			newbutdel = document.createElement('button');
  			newbutdel.textContent = "Löschen";
  			newbutdel.id = "de" + itemid;
  			newbutdel.className = "löschbutton";
			newcell3.appendChild(newbutdel)
		newrow.appendChild(newcell3);
	list.appendChild(newrow);
	generischEventlistenercheck(itemid);
  generischEventlistenerdel(itemid);
}

// function alllistsbox(allitemsjson){
//   for (var i = 1; i < allitemsjson.length; i++) {
//     createlistbuttonbox(allitemsjson[i]._id, allitemsjson[i].name)
//   }
// }

function alllistsbox(allitemsjson){
  for (var i = 0; i < allitemsjson.length; i++) {
    var listlist = document.querySelector('#listlist');
    // var listid = "abc";
    newbox = document.createElement('li');
      newbox.id = "li" + allitemsjson[i]._id;
      console.log(newbox.id)
      newbox.className = "anotherlist";
      newbox.textContent = allitemsjson[i].name;
      newbox.style.backgroundColor = "lightgreen";
    listlist.appendChild(newbox);
    generischEventlistenerakt(allitemsjson[i]._id, allitemsjson[i]);
  }
}

async function createnewlist(newlistname = {}){
  var getallurl = urlshort.slice(0, urlshort.length - 1);
  console.log(getallurl);
  const response = await fetch(getallurl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'a24fb077b67a5dedc043ac28afbea9c6',
    },
    body: JSON.stringify(newlistname),
  });
  var getalllistsjson = await response.json();
  console.log(getalllistsjson);
  closedialog();
  deletealllistboxes();
  getalllists();
}

function deletealllistboxes(){
  // var elements = document.getElementsByClassName("itemrows");
  //     while(elements.length > 0){
  //         elements[0].parentNode.removeChild(elements[0]);
      // }
  var node= document.getElementById("listlist");
  node.querySelectorAll('*').forEach(n => n.remove());
}

function generischEventlistenerakt(listid, jsoncontent){
  var listbox = document.getElementById("li" + listid);
  listbox.addEventListener("click", function(){
    allitemsdel();
    urlgenerator(jsoncontent._id);
    document.getElementById("inputpostitem").value = "";
    var def = document.getElementsByClassName("anotherlist");
    for (var i = 0; i < def.length; i++) {
      def[i].style.backgroundColor = "lightgreen";
    }
    document.getElementById("li" + listid).style.backgroundColor = "lightblue";
  });
}

function opendialog(){
  dialog.showModal();
}

function closedialog(){
  dialog.close();
}

function setlistid(){
  var listid = document.getElementById("idlistinput").value;
  urlgenerator(listid);
  closedialog();
}

// Onload bzgl EventListener

window.onload = function() {
  urlshort = 'http://shopping-lists-api.herokuapp.com/api/v1/lists/';
  urlgenerator('5db025be2e4f8f0017e5c5b0')
  getalllists();

  var postrequest = document.getElementById("postrequest");
  postrequest.addEventListener("click", testparpos);

  var inputposenter = document.getElementById("inputpostitem");
  inputposenter.addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
      testparpos();
    }
  });

  checkBox = document.getElementById("subscribeNews6");

  var listidpost = document.getElementById("listidpost");
  listidpost.addEventListener("click", function(){
    var newname = document.getElementById("idlistinput").value;
    var newlistname = {"name": newname};
    createnewlist(newlistname);
  })

  idnrdict = {};

  var banner = document.getElementById("Banner");
  banner.addEventListener("click", function(){
    allitemsdel();
    var defaultcontent = document.createElement('td');
    defaultcontent.textContent = "Es wurde noch keine der Listen geladen.";
    document.getElementById("createreturn").appendChild(document.createElement('tr').appendChild(defaultcontent));
    var aktlistname = document.getElementsByClassName("aktlistname");
    for (var i = 0; i < aktlistname.length; i++){
      aktlistname[i].textContent = "Listen";
    }
    var def = document.getElementsByClassName("anotherlist");
    for (var i = 0; i < def.length; i++) {
      def[i].style.backgroundColor = "lightgreen";
    }
  });

  var listinputstop = document.getElementById("listinputstop");
  listinputstop.addEventListener("click", closedialog);

  var startdialog = document.getElementById("startdialog");
  startdialog.addEventListener("click", opendialog);

  dialog = document.getElementById("dialogbox");

  var idlistinput = document.getElementById("idlistinput");
  idlistinput.addEventListener("click", function(){
     idlistinput.value = "";
  });
}

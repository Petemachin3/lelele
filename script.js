// Functions
function urlgenerator(newlistid, listbyid = false){
  listid = newlistid;
  var url = urlshort + newlistid;
  // allitemsdel();
  delitemsbyparent("createreturn");
  apiabfrage(url, listbyid);
}

async function apiabfrage(url, listbyid) {
  const response = await fetch(url);
  getJson = await response.json();
  // c = JSON.stringify(getJson);

	allitemget(getJson);
  if (listbyid) {
    console.log(listbyid);
    listboxbyid(getJson);
  }
}

async function postdata(url = '', data = {}, requesttype = '', deletelist = false){
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
	// console.log(JSON.stringify(getJson));

  if (deletelist) {
    delitemsbyparent("createreturn");
  }
  else {
    delitemsbyparent("createreturn");
    allitemget(getJson);
  }
}

async function getalllists(listdel = false){
  var getallurl = urlshort.slice(0, urlshort.length - 1);
  // console.log(getallurl);
  const response = await fetch(getallurl, {method: "GET", headers: {'Content-Type': 'application/json', 'Authorization': 'a24fb077b67a5dedc043ac28afbea9c6'}});
  getalllistsjson = await response.json();
  // console.log(getalllistsjson[0]._id);
  alllistsbox(getalllistsjson);
  console.log(listid);
  if (!listdel) {
    document.getElementById("li" + listid).style.backgroundColor = "lightblue";
  }

}

function testpardel(itemid){
  delurl = urlshort + listid + "/items/" + itemid;
  postdata(delurl, {}, "DELETE");
}

function testparpos(){
  var inputpostitemdata = document.getElementById("inputpostitem").value;
  if (inputpostitemdata == "") {
    //console.log = ("Leeres Eingabefeld")
  }
  else{
    inputpostitemdata = {"name": inputpostitemdata};
    //console.log(typeof(inputpostitemdata));
    posurl = urlshort + listid + "/items";
    postdata(posurl, inputpostitemdata, "POST");
    document.getElementById("inputpostitem").value = "";
  }
}

function testparput(itemid){
  var itemnr = idnrdict[itemid];
  var putitemdata;
	getbought = getJson.items[itemnr].bought;
	// console.log(typeof(getbought));
	if (getbought) {
		putitemdata = {"bought": "false"};
	}
	else {
		putitemdata = {"bought": "true"};
	}
  var puturl = urlshort + listid + "/items/" + itemid
  postdata(puturl, putitemdata, "PUT");
}

function bridgecreateaufruf(itemnr, jsoncontent){
	var itemname = jsoncontent.items[itemnr].name;
	var itembought = jsoncontent.items[itemnr].bought;
	var itemid = jsoncontent.items[itemnr]._id;
  idnrdict[itemid] = itemnr;
	createaufruf(itembought, itemname, itemid, itemnr);
}


async function allitemget(jsoncontent){
  delitemsbyparent("qrcodelistpic"); // vorhandenen QRCode löschen
  makingqrcode(urlshort + listid, "80", "90EE90", "qrcodelistpic");
  // *************** vorherigen Header löschen, falls vorhanden
  delitemsbyparent("listheader");
  // *************** Infos über die Liste als "Header" im body erstellen (inkl Löschbutton der Liste)
  var listheader = document.getElementById("listheader");
    var spanlistid = document.createElement('li');
      spanlistid.textContent = listid;
    var spanemaillink = document.createElement('li');
      var hyperlinklistid = document.createElement('a');
        hyperlinklistid.textContent = "Share via Email";
        hyperlinklistid.id = "si" + listid; // si --> span id (list)
        hyperlinklistid.href= "mailto:pistolmn@gmx.de?subject=My shopping list (" + jsoncontent.name + ")&body=Hi there,%0D%0A %0D%0AI got great news for you! I created a shopping list which you can reach at the following adress: %0D%0A %0D%0A" + urlshort + listid;
      spanemaillink.appendChild(hyperlinklistid);
    var spanlistdel = document.createElement('li');
      spanlistdel.id = "sd" + listid; // sd --> span delete
      var butlistdel = document.createElement('button');
        butlistdel.textContent = "Liste löschen";
        butlistdel.id = "bd" + listid; // bd --> button delete
        butlistdel.className = "buttontext";
      spanlistdel.appendChild(butlistdel);
    var spanlistcopy = document.createElement('li');
      spanlistcopy.id = "sc" + listid; // sd --> span delete
      var butlistcopy = document.createElement('button');
        butlistcopy.textContent = "ID kopieren";
        butlistcopy.id = "bc" + listid; // bd --> button delete
        butlistcopy.className = "buttontext";
        butlistcopy.addEventListener("click", function(){
          const el = document.createElement('textarea');
          el.value = listid;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
        })
      spanlistcopy.appendChild(butlistcopy);
    var spansharewa = document.createElement('li');
      spansharewa.id = "wa" + listid;
      var qrwapic = document.createElement('img');
        qrwapic.alt = "Whatsapp teilen QrCode";
        qrwapic.id = "wp" + listid;
      spansharewa.appendChild(qrwapic);

    listheader.appendChild(spanlistdel);
    listheader.appendChild(spanlistcopy);
    listheader.appendChild(spanlistid);
    listheader.appendChild(spanemaillink);
    listheader.appendChild(spansharewa);
  generischEventlistenerlistdel(listid);

  //************* QR Code der Items
  var listitemsname = [];
	for (var i = 0; i < jsoncontent.items.length; i++){
		bridgecreateaufruf(i.toString(), jsoncontent);
    listitemsname.push(jsoncontent.items[i].name);
	}

  var allitemsplaintext = creatplaintextfromjson(jsoncontent, listitemsname);

  delitemsbyparent("qrcodeitemspic"); //vorhandenen QRCode löschen
  makingqrcode(allitemsplaintext, "120", "ADD8E6", "qrcodeitemspic");

  var waplaintext = creatplaintextfromjson(jsoncontent, listitemsname, true);
  document.getElementById("wp" + listid).src = "http://api.qrserver.com/v1/create-qr-code/?data=https://api.whatsapp.com/send?text=" + waplaintext + "&size=100x100&ecc=h&color=FF0000&bgcolor=ADD8E6"
  var aktlistname = document.getElementsByClassName("aktlistname");
  for (var i = 0; i < aktlistname.length; i++){
    aktlistname[i].textContent =jsoncontent.name;
  }
}

function creatplaintextfromjson(jsoncontent, listitemsname, washare = false){
  var allitemsplaintext = "";
  if (listitemsname.length == 0) {
    allitemsplaintext = "noch keine Items vorhanden";
  }
  else {
    allitemsplaintext = jsoncontent.name + ":%0A%0A"
  }
  var spacechar = "";
  if (washare) {
    spacechar = "";
  }
  else {
    spacechar = "%20";
  }
  for (var i = 0; i < listitemsname.length; i++) {
    if (jsoncontent.items[i].bought) {
      var itemchecked = spacechar + "[checked]" + spacechar;
    }
    else {
      var itemchecked = spacechar + "[unchecked]" + spacechar;
    }
    allitemsplaintext += "-" + spacechar + listitemsname[i] + itemchecked + "%0A"; // Formatierung der Items im QR
    console.log(allitemsplaintext);
  }

  return allitemsplaintext;
}

function generischEventlistenerlistdel(listid){
	var listdeletebox = document.getElementById("bd" + listid);
	listdeletebox.addEventListener("click", async function(){

      postdata(urlshort + listid, {}, "DELETE", true);
      console.log(listid);
      delitemsbyparent("listlist");
      setstartpage();
      await Sleep(300); // Timer, da löschen auf dem Server einen Moment dauert
      getalllists(true);
      setstartpage();
	});
}

function Sleep(milliseconds) {
   return new Promise(resolve => setTimeout(resolve, milliseconds));
}
//
// function allitemsdel(){
//   var node= document.getElementById("createreturn");
//   node.querySelectorAll('*').forEach(n => n.remove());
// }

// function deletealllistboxes(){
//   console.log("Listboxes werden gelöscht")
//   var node= document.getElementById("listlist");
//   node.querySelectorAll('*').forEach(n => n.remove());
// }

function delitemsbyparent(parentid = ""){
  // console.log("Listboxes werden gelöscht");
  var node= document.getElementById(parentid);
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
  var tabitems = document.getElementById("createreturn");
// ********* alle Items einer Liste im html erstellen (inkl buttons)
  var newrow = document.createElement('tr');
    newrow.id = "row" + itemid;
    newrow.className = "itemrows";
		var newcell1 = document.createElement('td');
			var newbutput = document.createElement('input');
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
				var newbutputlab = document.createElement('label');
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
	tabitems.appendChild(newrow);
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
    var listlist = document.getElementById("listlist");
    // var listid = "abc";
    newbox = document.createElement('li');
      newbox.id = "li" + allitemsjson[i]._id;
      // console.log(newbox.id)
      newbox.className = "anotherlist";
      newbox.textContent = allitemsjson[i].name;
      newbox.style.backgroundColor = "lightgreen";
    listlist.appendChild(newbox);
    generischEventlistenerakt(allitemsjson[i]._id, allitemsjson[i]);
  }
}

function listboxbyid(allitemsjson){
  delitemsbyparent("listboxbyid");
  var listlist = document.getElementById("listboxbyid");
  // var listid = "abc";
  console.log("listboxbyid")
  newbox = document.createElement('li');
    newbox.id = "il" + allitemsjson._id; // id "li" + itemid ist evtl schon vergeben
    // console.log(newbox.id)
    newbox.className = "anotherlist";
    newbox.textContent = allitemsjson.name;
    newbox.style.backgroundColor = "lightblue";
  listlist.appendChild(newbox);
  generischEventlistenerakt(allitemsjson._id, allitemsjson, true);
}

async function createnewlist(){
  // console.log(newlistname);
  var getallurl = urlshort.slice(0, urlshort.length - 1);
  // console.log(getallurl);
  var newname = document.getElementById("idlistinput").value;
  var newlistname = {"name": newname};
  // console.log(newlistname);
  const response = await fetch(getallurl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'a24fb077b67a5dedc043ac28afbea9c6',
    },
    body: JSON.stringify(newlistname),
  });
  var getalllistsjson = await response.json();
  // console.log(getalllistsjson._id);
  urlgenerator(getalllistsjson._id);
  closedialog();
  delitemsbyparent("listlist");
  getalllists();
}

function generischEventlistenerakt(listid, jsoncontent, getlistbyid = false){
  console.log("test")
  if (getlistbyid) {
    var listbox = document.getElementById("il" + listid);
  }
  else {
    var listbox = document.getElementById("li" + listid);
  }
  listbox.addEventListener("click", function(){
    // allitemsdel();
    console.log("imEventlistener");
    delitemsbyparent("createreturn");
    urlgenerator(jsoncontent._id);
    document.getElementById("inputpostitem").value = "";
    var def = document.getElementsByClassName("anotherlist");
    for (var i = 0; i < def.length; i++) {
      def[i].style.backgroundColor = "lightgreen";
    }
    if (getlistbyid) {
      var listboxstr = "il" + listid;
    }
    else {
      var listboxstr = "li" + listid;
    }
    document.getElementById(listboxstr).style.backgroundColor = "lightblue";
  });
}

function opendialog(){
  document.getElementById("idlistinput").value = "";
  dialog.showModal();
}

function closedialog(){
  dialog.close();
}

// function setlistid(){
//   var listid = document.getElementById("idlistinput").value;
//   urlgenerator(listid);
//   closedialog();
// }

function setstartpage(){
  // allitemsdel();
  delitemsbyparent("createreturn");
  delitemsbyparent("listheader");
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
  };
}

async function getlistbyid(){
  setstartpage();
  var inputlistbyid = document.getElementById("inputlistbyid").value;
  console.log(inputlistbyid);
  urlgenerator(inputlistbyid, true);
}

function makingqrcode(codetext = "jo", length = "100", bgcolor = "FF0000", qrsection = "qrcodelistpic"){
  var qrcodepicsection = document.getElementById(qrsection)
  var qrcodepic = document.createElement('img');
    qrcodepic.src = "http://api.qrserver.com/v1/create-qr-code/?data=" + codetext + "&size=" + length + "x" + length + "&ecc=h&color=FF0000&bgcolor=" + bgcolor;
  qrcodepicsection.appendChild(qrcodepic);
}
//
// function delcach(){
//   localStorage.clear();
//   console.log("cache geleert");
// }


// Onload bzgl EventListener

window.onload = function() {
  urlshort = 'http://shopping-lists-api.herokuapp.com/api/v1/lists/';
  urlgenerator('5dc0779cb1366200179dc911');
  getalllists();

  var postrequest = document.getElementById("postrequest");
  postrequest.addEventListener("click", testparpos);

  var inputposenter = document.getElementById("inputpostitem");
  inputposenter.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
      testparpos();
    }
  });

  checkBox = document.getElementById("subscribeNews6");

  var listidpost = document.getElementById("listidpost");
  listidpost.addEventListener("click", function(){
    createnewlist();
  })

  idnrdict = {};

  var banner = document.getElementById("Banner");
  banner.addEventListener("click", setstartpage)

  var listinputstop = document.getElementById("listinputstop");
  listinputstop.addEventListener("click", closedialog);

  var startdialog = document.getElementById("startdialog");
  startdialog.addEventListener("click", opendialog);

  dialog = document.getElementById("dialogbox");

  var idlistinput = document.getElementById("idlistinput");
  idlistinput.addEventListener("click", function(){
     idlistinput.value = "";
  });

  idlistinput.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
      createnewlist();
    }
  });

  // var delcachebutton = document.getElementById("delcache")
  // delcachebutton.addEventListener("click", delcach);

  // window.addEventListener("keydown", function(event) {
  //   if (event.keyCode == 32) {
  //     opendialog();
  //   }
  // });

  var butlistbyid = document.getElementById("butlistbyid");
  butlistbyid.addEventListener("click", getlistbyid);

  var inputlistbyid = document.getElementById("inputlistbyid");
  inputlistbyid.addEventListener("click", function(){
     inputlistbyid.value = "";
  });

  inputlistbyid.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
      getlistbyid();
    }
  });

  sideopen = true;

  var buttonside = document.getElementById("buttonside");
  buttonside.addEventListener("click", sidetoggle)

}

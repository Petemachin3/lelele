// Functions
function urlgenerator(newlistid, listbyid = false) {
  listid = newlistid;
  var url = urlshort + newlistid;
  // allitemsdel();
  delitemsbyparent("createreturn");
  apiabfrage(url, listbyid);
}

async function apiabfrage(url, listbyid) {
  try {
    const response = await fetch(url);
    getJson = await response.json();

    allitemget(getJson);
    if (listbyid) {
      listboxbyid(getJson);
    }
  } catch (e) {
    var secdialog = document.getElementById("secdialog");
    var qrdialog = document.createElement('dialog');
    qrdialog.className = "qrdialog";
    qrdialog.id = "da";
    var textcode = document.createElement('h2');
    textcode.textContent = "Du bist gestrandet:";
    textcode.style.margin = "2px";
    textcode.style.borderRadius = "5px";
    textcode.style.backgroundColor = "#ADD8E6";
    textcode.style.padding = "5px";
    var textcodenewline = document.createElement('h3');
    textcodenewline.textContent = e;
    textcode.appendChild(textcodenewline);
    qrdialog.appendChild(textcode);
    var diasharewa = document.createElement('img');
    diasharewa.alt = "Whatsapp teilen QrCode";
    diasharewa.id = "ap";
    diasharewa.style.borderRadius = "5px";
    diasharewa.src = "https://t4.ftcdn.net/jpg/00/02/46/83/500_F_2468300_PczW2Yq9Wgq9I6GYrAx7H5kthMnx7m.jpg"
    diasharewa.className = "waqrcode";
    qrdialog.appendChild(diasharewa);
    var abbrechbutt = document.createElement('button');
    abbrechbutt.textContent = "Fenster schließen";
    abbrechbutt.className = "buttontext";
    abbrechbutt.style.marginTop = "10px";
    abbrechbutt.style.float = "right";
    abbrechbutt.style.borderWidth = "5px";
    abbrechbutt.style.fontWeight = "700";
    abbrechbutt.style.backgroundColor = "#ADD8E6";
    abbrechbutt.addEventListener("click", function () {
      // delitemsbyparent("qrdialogsec"); //QRCode löschen
      closedialog(qrdialog);
    });
    qrdialog.appendChild(abbrechbutt);
    secdialog.appendChild(qrdialog);
    opendialog(qrdialog);
  }

}

async function postdata(url = '', data = {}, requesttype = '', deletelist = false) {
  const response = await fetch(url, {
    method: requesttype, // *GET, POST, PUT, DELETE
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'a24fb077b67a5dedc043ac28afbea9c6',
    },
    body: JSON.stringify(data)
  });
  getJson = await response.json();

  if (deletelist) {
    delitemsbyparent("createreturn");
  }
  else {
    delitemsbyparent("createreturn");
    allitemget(getJson);
  }
}

async function getalllists(listdel = false) {
  var getallurl = urlshort.slice(0, urlshort.length - 1);
  const response = await fetch(getallurl, { method: "GET", headers: { 'Content-Type': 'application/json', 'Authorization': 'a24fb077b67a5dedc043ac28afbea9c6' } });
  getalllistsjson = await response.json();
  alllistsbox(getalllistsjson);
  if (!listdel) {
    document.getElementById("li" + listid).style.backgroundColor = "lightblue";
  }

}

function testpardel(itemid) {
  delurl = urlshort + listid + "/items/" + itemid;
  postdata(delurl, {}, "DELETE");
}

function testparpos() {
  var inputpostitemdata = document.getElementById("inputpostitem").value;
  if (!inputpostitemdata == "") {
    inputpostitemdata = { "name": inputpostitemdata };
    posurl = urlshort + listid + "/items";
    postdata(posurl, inputpostitemdata, "POST");
    document.getElementById("inputpostitem").value = "";
  }
}

function testparput(itemid) {
  var itemnr = idnrdict[itemid];
  var putitemdata;
  getbought = getJson.items[itemnr].bought;
  if (getbought) {
    putitemdata = { "bought": "false" };
  }
  else {
    putitemdata = { "bought": "true" };
  }
  var puturl = urlshort + listid + "/items/" + itemid
  postdata(puturl, putitemdata, "PUT");
}

function bridgecreateaufruf(itemnr, jsoncontent) {
  var itemname = jsoncontent.items[itemnr].name;
  var itembought = jsoncontent.items[itemnr].bought;
  var itemid = jsoncontent.items[itemnr]._id;
  idnrdict[itemid] = itemnr;
  createaufruf(itembought, itemname, itemid, itemnr);
}


async function allitemget(jsoncontent) {
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
  hyperlinklistid.className = "buttontext";
  hyperlinklistid.href = "mailto:pistolmn@gmx.de?subject=My shopping list (" + jsoncontent.name + ")&body=Hi there,%0D%0A %0D%0AI got great news for you! I created a shopping list which you can reach at the following adress: %0D%0A %0D%0A" + urlshort + listid + " %0D%0A %0D%0AWe hope you'll enjoy our site, cheers!";
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
  butlistcopy.addEventListener("click", function () {
    const el = document.createElement('textarea');
    el.value = listid;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  })
  spanlistcopy.appendChild(butlistcopy);

  //QRCode Dialog
  // var qrdialog = document.getElementById('qrdialog');
  var secdialog = document.getElementById("secdialog");
  var qrdialog = document.createElement('dialog');
  qrdialog.className = "qrdialog";
  qrdialog.id = "di" + listid;
  var diasharewa = document.createElement('img');
  diasharewa.alt = "Whatsapp teilen QrCode";
  diasharewa.id = "wp" + listid;
  diasharewa.className = "waqrcode";
  qrdialog.appendChild(diasharewa);
  var abbrechbutt = document.createElement('button');
  abbrechbutt.textContent = "Fenster schließen";
  abbrechbutt.className = "buttontext";
  abbrechbutt.style.marginTop = "10px";
  abbrechbutt.style.float = "right";
  abbrechbutt.style.borderWidth = "5px";
  abbrechbutt.style.fontWeight = "700";
  abbrechbutt.style.backgroundColor = "#ADD8E6";
  abbrechbutt.addEventListener("click", function () {
    // delitemsbyparent("qrdialogsec"); //QRCode löschen
    closedialog(qrdialog);
  });
  qrdialog.appendChild(abbrechbutt);
  secdialog.appendChild(qrdialog);
  // QRCode Button
  var spansharewa = document.createElement('li');
  spansharewa.id = "wa" + listid;
  var qrwabut = document.createElement('button');
  qrwabut.id = "wb" + listid;
  qrwabut.textContent = "Mit Whatsapp teilen";
  qrwabut.className = "buttontext";
  qrwabut.addEventListener("click", function () {
    opendialog(qrdialog);
  });
  spansharewa.appendChild(qrwabut);


  listheader.appendChild(spanlistdel);
  listheader.appendChild(spanlistcopy);
  listheader.appendChild(spanlistid);
  listheader.appendChild(spanemaillink);
  listheader.appendChild(spansharewa);
  generischEventlistenerlistdel(listid);

  //************* QR Code der Items
  var listitemsname = [];
  if (!(jsoncontent.items.length == 0)) {

    for (var i = 0; i < jsoncontent.items.length; i++) {
      bridgecreateaufruf(i.toString(), jsoncontent);
      listitemsname.push(jsoncontent.items[i].name);
    }
  }

  var allitemsplaintext = creatplaintextfromjson(jsoncontent, listitemsname);

  delitemsbyparent("qrcodeitemspic"); //vorhandenen QRCode löschen
  makingqrcode(allitemsplaintext, "120", "D3D3D3", "qrcodeitemspic", "000000");

  var waplaintext = creatplaintextfromjson(jsoncontent, listitemsname, true);
  diasharewa.src = "http://api.qrserver.com/v1/create-qr-code/?data=https://api.whatsapp.com/send?text=" + waplaintext + "&size=500x500&ecc=h&color=000000&bgcolor=ADD8E6"
  var aktlistname = document.getElementsByClassName("aktlistname");
  for (var i = 0; i < aktlistname.length; i++) {
    aktlistname[i].textContent = jsoncontent.name;
  }
}

function creatplaintextfromjson(jsoncontent, listitemsname, washare = false) {
  var allitemsplaintext = "";
  var spacechar = "";
  if (washare) {
    spacechar = "_";
    allitemsplaintext = "*" + jsoncontent.name.replace(/ /g, spacechar) + "*" + ":%0A%0A";
  }
  else {
    spacechar = "%20";
    allitemsplaintext = jsoncontent.name + ":%0A%0A";
  }
  for (var i = 0; i < listitemsname.length; i++) {
    if (washare) {
      if (jsoncontent.items[i].bought) {
        var itemchecked = "~";
      }
      else {
        var itemchecked = "";
      }
      listitemsname[i] = listitemsname[i].replace(/ /g, spacechar);
      allitemsplaintext += itemchecked + listitemsname[i] + itemchecked + "%0A"; // Formatierung der Items im QR
    }
    else {
      if (jsoncontent.items[i].bought) {
        var itemchecked = spacechar + "[checked]";
      }
      else {
        var itemchecked = spacechar + "[unchecked]";
      }
      allitemsplaintext += "-" + spacechar + listitemsname[i] + itemchecked + "%0A"; // Formatierung der Items im QR
    }
  }
  if (listitemsname.length == 0) {
    if (washare) {
      allitemsplaintext = "*" + jsoncontent.name + "*" + ":%0A%0Anoch_keine_Items_vorhanden";
    }
    else {
      allitemsplaintext = jsoncontent.name + ":%0A%0Anoch keine Items vorhanden";
    }

  }

  return allitemsplaintext;
}

function generischEventlistenerlistdel(listid) {
  var listdeletebox = document.getElementById("bd" + listid);
  listdeletebox.addEventListener("click", async function () {

    delitemsbyparent("qrcodelistpic"); //QRCode löschen
    delitemsbyparent("qrcodeitemspic"); //QRCode löschen
    // delitemsbyparent("qrdialogsec"); //QRCode löschen
    postdata(urlshort + listid, {}, "DELETE", true);
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

function delitemsbyparent(parentid = "") {
  var node = document.getElementById(parentid);
  node.querySelectorAll('*').forEach(n => n.remove());
}

function generischEventlistenercheck(itemid) {
  var checkbox = document.getElementById("ch" + itemid);
  var checkboxvalue = checkbox.id;
  checkbox.addEventListener("click", function () {
    testparput(itemid);
  });
}

function generischEventlistenerdel(itemid) {
  var deletebox = document.getElementById("de" + itemid);
  var deleteboxvalue = deletebox.id;
  deletebox.addEventListener("click", function () {
    var itemid = deleteboxvalue.slice(2, deleteboxvalue.length);
    testpardel(itemid);
  });
}

function createaufruf(bought, itemname = "", itemid, itemnr) {
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

function alllistsbox(allitemsjson) {
  for (var i = 0; i < allitemsjson.length; i++) {
    var listlist = document.getElementById("listlist");
    newbox = document.createElement('li');
    newbox.id = "li" + allitemsjson[i]._id;
    newbox.className = "anotherlist";
    newbox.textContent = allitemsjson[i].name;
    newbox.style.backgroundColor = "lightgreen";
    listlist.appendChild(newbox);
    generischEventlistenerakt(allitemsjson[i]._id, allitemsjson[i]);
  }
}

function listboxbyid(allitemsjson) {
  delitemsbyparent("listboxbyid");
  var listlist = document.getElementById("listboxbyid");
  newbox = document.createElement('li');
  newbox.id = "il" + allitemsjson._id; // id "li" + itemid ist evtl schon vergeben
  newbox.className = "anotherlist";
  newbox.textContent = allitemsjson.name;
  newbox.style.backgroundColor = "lightblue";
  listlist.appendChild(newbox);
  generischEventlistenerakt(allitemsjson._id, allitemsjson, true);
}

async function createnewlist() {
  var getallurl = urlshort.slice(0, urlshort.length - 1);
  var newname = document.getElementById("idlistinput").value;
  var newlistname = { "name": newname };
  const response = await fetch(getallurl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'a24fb077b67a5dedc043ac28afbea9c6',
    },
    body: JSON.stringify(newlistname),
  });
  var getalllistsjson = await response.json();
  urlgenerator(getalllistsjson._id);
  closedialog(sidedialog);
  delitemsbyparent("listlist");
  getalllists();
}

function generischEventlistenerakt(listid, jsoncontent, getlistbyid = false) {
  if (getlistbyid) {
    var listbox = document.getElementById("il" + listid);
  }
  else {
    var listbox = document.getElementById("li" + listid);
  }
  listbox.addEventListener("click", function () {
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

function opendialog(dialog) {
  document.getElementById("idlistinput").value = "";
  dialog.showModal();
}

function closedialog(dialog) {
  dialog.close();
}

// function setlistid(){
//   var listid = document.getElementById("idlistinput").value;
//   urlgenerator(listid);
//   closedialog();
// }

function setstartpage() {
  // allitemsdel();
  delitemsbyparent("qrcodelistpic"); //QRCode löschen
  delitemsbyparent("qrcodeitemspic"); //QRCode löschen
  delitemsbyparent("createreturn");
  delitemsbyparent("listheader");
  var defaultcontent = document.createElement('td');
  defaultcontent.textContent = "Es wurde noch keine der Listen geladen.";
  document.getElementById("createreturn").appendChild(document.createElement('tr').appendChild(defaultcontent));
  var aktlistname = document.getElementsByClassName("aktlistname");
  for (var i = 0; i < aktlistname.length; i++) {
    aktlistname[i].textContent = "Listen";
  }
  var def = document.getElementsByClassName("anotherlist");
  for (var i = 0; i < def.length; i++) {
    def[i].style.backgroundColor = "lightgreen";
  };
}

async function getlistbyid() {
  setstartpage();
  var inputlistbyid = document.getElementById("inputlistbyid").value;
  urlgenerator(inputlistbyid, true);
}

function makingqrcode(codetext = "jo", length = "100", bgcolor = "000000", qrsection = "qrcodelistpic", color = "000000") {
  var qrcodepicsection = document.getElementById(qrsection)
  var qrcodepic = document.createElement('img');
  qrcodepic.src = "http://api.qrserver.com/v1/create-qr-code/?data=" + codetext + "&size=" + length + "x" + length + "&ecc=h&color=" + color + "&bgcolor=" + bgcolor;
  qrcodepic.id = "qr" + qrsection;
  qrcodepicsection.appendChild(qrcodepic);
}

// Onload bzgl EventListener

window.onload = function () {
  urlshort = 'http://shopping-lists-api.herokuapp.com/api/v1/lists/';
  urlgenerator('5dc1ab22bbc1f70017c2ffa2');
  getalllists();

  var postrequest = document.getElementById("postrequest");
  postrequest.addEventListener("click", testparpos);

  var inputposenter = document.getElementById("inputpostitem");
  inputposenter.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) {
      testparpos();
    }
  });

  checkBox = document.getElementById("subscribeNews6");

  var listidpost = document.getElementById("listidpost");
  listidpost.addEventListener("click", function () {
    createnewlist();
  })

  idnrdict = {};

  var banner = document.getElementById("Banner");
  banner.addEventListener("click", setstartpage)

  var listinputstop = document.getElementById("listinputstop");
  listinputstop.addEventListener("click", function () {
    closedialog(sidedialog);
  });

  var startdialog = document.getElementById("startdialog");
  startdialog.addEventListener("click", function () {
    opendialog(sidedialog);
  });

  sidedialog = document.getElementById("dialogbox");

  var idlistinput = document.getElementById("idlistinput");
  idlistinput.addEventListener("click", function () {
    idlistinput.value = "";
  });

  idlistinput.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) {
      createnewlist();
    }
  });

  var butlistbyid = document.getElementById("butlistbyid");
  butlistbyid.addEventListener("click", getlistbyid);

  var inputlistbyid = document.getElementById("inputlistbyid");
  inputlistbyid.addEventListener("click", function () {
    inputlistbyid.value = "";
  });

  inputlistbyid.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) {
      getlistbyid();
    }
  });

}

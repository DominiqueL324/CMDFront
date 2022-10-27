//import {asurl_not_paginated,token,admin_add,agent_add,client_add,salarie_add,user_all,base_local,base_online} from "./url";
//import {asurl_not_paginated,token,admin_add,agent_add,client_add,salarie_add,user_all,base_local,base_online} from "./url";
var pg = "";
var i = 1;
var max = 0;

function getAllUsers() {
  var content = "";
  var url_go = base_local + "/admin_app/users/";
  $.ajax({
    type: "GET",
    url: url_go,
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      var cas_ = "";
      var classe = "";
      var societe = "";
      var i = 1;
      max_ = Math.round(parseInt(response["count"]) / 10);
      $("#total").text(max_);
      $("#contentTableUser").empty();
      response["results"].forEach((elt) => {
        var id_toget = 0;
        if (elt["groups"][0]["group"] == "Administrateur") {
          id_toget = elt["administrateur"]["id"];
        }
        if (elt["groups"][0]["group"] == "Salarie") {
          id_toget = elt["salarie"]["id"];
        }
        if (elt["groups"][0]["group"] == "Client particulier") {
          id_toget = elt["client"]["id"];
        }
        if (
          elt["groups"][0]["group"] == "Agent secteur" ||
          elt["groups"][0]["group"] == "Agent constat" ||
          elt["groups"][0]["group"] == "Audit planneur"
        ) {
          id_toget = elt["agent"];
        }
        if (elt["groups"][0]["group"] == "Client pro") {
          societe = elt["client"]["societe"];
          id_toget = elt["client"]["id"];
        } else {
          societe = "RAS";
        }
        if (elt["is_active"] == true) {
          cas_ = "activé";
          classe = "badge badge-success";
        } else {
          cas_ = "désactivé";
          classe = "badge badge-danger";
        }
        $("#contentTableUser").append(
          "<tr>\
                        <td>" +
            i +
            "</td>\
                        <td>" +
            elt["first_name"] +
            " " +
            elt["last_name"] +
            "</td>\
                        <td>" +
            elt["email"] +
            '</td>\
                        <td class="text-center">\
                            <span class="badge badge-success">' +
            elt["groups"][0]["group"] +
            "</span>\
                        </td>\
                        <td>" +
            societe +
            '</td>\
                        <td>\
                            <span class="' +
            classe +
            '" style=" cursor: pointer; text-decoration: underline;border-radius: 4px;" >' +
            cas_ +
            "</span>\
                        </td>\
                        <td>\
                            <a onclick='goWhereEdit(" +
            id_toget +
            ',"' +
            elt["groups"][0]["group"] +
            '"' +
            ')\' ><i class="bi bi-pencil-square"style="color: rgb(0, 0, 0)"></i></a>&nbsp;;<a  onclick=\'goWhereEdit1(' +
            id_toget +
            ',"' +
            elt["groups"][0]["group"] +
            '"' +
            ')\' ><i class="bi bi-eye" style="color: rgb(136, 102, 119)"></i></a>\
                        </td>\
                    </tr>'
        );
        i++;
      });
    },
    error: function (response) {
      console.log(response);
    },
  });
}
$("#next").on("click", function () {
  i = i + 1;
  getNext();
  $("#actuel").text("");
  $("#actuel").text(i);
  return;
});
$("#prev").on("click", function () {
  var usr = "";
  if (i == 2) {
    usr = base_local + "/admin_app/users/";
    getPrev(usr);
    return;
  } else if (i == 1) {
    $("#actuel").text("");
    $("#actuel").text(i);
  } else if (i < 1) {
    i = 1;
    return;
  } else {
    i = i - 1;
    usr = base_local + "/admin_app/users/?page=" + i.toString();
    getPrev(usr);
    $("#actuel").text("");
    $("#actuel").text(i);
    return;
  }
});

function getPrev(url_) {
  code(url_);
}

function getNext() {
  if (i < max_) {
    usr = base_local + "/admin_app/users/?page=" + i.toString();
    code(usr);
  } else {
    alert("Dernière page");
    return;
  }
}

function code(url_) {
  $.ajax({
    type: "GET",
    url: url_,
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      $("#contentTableUser").empty();
      var cas_ = "";
      var classe = "";
      var societe = "";
      var i = 1;
      response["results"].forEach((elt) => {
        var id_toget = 0;
        if (elt["groups"][0]["group"] == "Administrateur") {
          id_toget = elt["administrateur"];
        }
        if (elt["groups"][0]["group"] == "Salarie") {
          id_toget = elt["salarie"]["id"];
        }
        if (elt["groups"][0]["group"] == "Client particulier") {
          id_toget = elt["client"]["id"];
        }
        if (
          elt["groups"][0]["group"] == "Agent secteur" ||
          elt["groups"][0]["group"] == "Agent constat" ||
          elt["groups"][0]["group"] == "Audit planneur"
        ) {
          id_toget = elt["agent"];
        }
        if (elt["groups"][0]["group"] == "Client pro") {
          societe = elt["client"]["societe"];
          id_toget = elt["client"]["id"];
        } else {
          societe = "RAS";
        }
        if (elt["is_active"] == true) {
          cas_ = "activé";
          classe = "badge badge-success";
        } else {
          cas_ = "désactivé";
          classe = "badge badge-danger";
        }

        $("#contentTableUser").append(
          "<tr>\
                        <td>" +
            i +
            "</td>\
                        <td>" +
            elt["first_name"] +
            " " +
            elt["last_name"] +
            "</td>\
                        <td>" +
            elt["email"] +
            '</td>\
                        <td class="text-center">\
                            <span class="badge badge-success">' +
            elt["groups"][0]["group"] +
            "</span>\
                        </td>\
                        <td>" +
            societe +
            '</td>\
                        <td>\
                            <span class="' +
            classe +
            '" style=" cursor: pointer; text-decoration: underline;border-radius: 4px;" >' +
            cas_ +
            "</span>\
                        </td>\
                        <td>\
            <a  onclick='goWhereEdit(" +
            id_toget +
            ',"' +
            elt["groups"][0]["group"] +
            '"' +
            ')\' ><i class="bi bi-pencil-square"style="color: rgb(0, 0, 0)"></i></a>&nbsp;<a  onclick=\'goWhereEdit1(' +
            id_toget +
            ',"' +
            elt["groups"][0]["group"] +
            '"' +
            ')\' ><i class="bi bi-eye" style="color: rgb(136, 102, 119)"></i></a>\
                        </td>\
                    </tr>'
        );
        i++;
      });
    },
    error: function (response) {
      console.log(response);
    },
  });
}
$("#filtre").on("keyup", function () {
  var val = $("#filtre").val();
  var url_ = base_local + "/admin_app/users/?value=" + val;
  code(url_);
});

function goWhereEdit(id, groupe) {
  $.cookie("id_user_edit", id);
  if (groupe == "Client pro") {
    $.cookie("road", 3);
    window.location.replace("edit_client.html");
  }
  if (groupe == "Client particulier") {
    $.cookie("road", 4);
    window.location.replace("edit_client_part.html");
  }
  if (
    groupe == "Agent secteur" ||
    groupe == "Audit planneur" ||
    groupe == "Agent constat"
  ) {
    alert($.cookie("id_user_edit"));
    $.cookie("road", 1);
    window.location.replace("edit-un-utilisateur.html");
  }
  if (groupe == "Administrateur") {
    $.cookie("road", 2);
    window.location.replace("edit-un-utilisateur.html");
  }
  if (groupe == "Salarie") {
    $.cookie("road", 7);
    window.location.replace("edit-un-utilisateur.html");
  }
}

function goWhereEdit1(id, groupe) {
  $.cookie("id_user_edit", id);
  if (groupe == "Client pro") {
    $.cookie("road", 3);
    window.location.replace("Tarifs.html");
  }
  if (groupe == "Client particulier") {
    $.cookie("road", 4);
    window.location.replace("Tarifs.html");
  }
  /*if(groupe == "Agent secteur" || groupe == "Audit planneur" || groupe == "Agent constat"){
        alert($.cookie('id_user_edit'))
        $.cookie('road', 1)
        window.location.replace("edit-un-utilisateur.html")
    }
    if(groupe == "Administrateur"){
        $.cookie('road', 2)
        window.location.replace("edit-un-utilisateur.html")
    }
    if(groupe == "Salarie"){
        $.cookie('road', 7)
        window.location.replace("edit-un-utilisateur.html")
    }*/
}

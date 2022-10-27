//import {asurl_not_paginated,token,admin_add,agent_add,client_add,salarie_add} from "./url";
$("#type_user").on("change", function () {
  if (
    $("#type_user").val() == "3" ||
    $("#type_user").val() == "5" ||
    $("#type_user").val() == "6"
  ) {
    if ($.cookie("group") == "Administrateur") {
      getAs();
      $("#as").css("display", "inline");
    }
    $("#secteur").css("display", "none");
    $("#sal_bloc1").css("display", "none");
    $("#sal_bloc2").css("display", "none");
    $("#sal_bloc3").css("display", "none");
  } else if ($("#type_user").val() == "2") {
    $("#as").empty();
    $("#as").css("display", "none");
    $("#secteur").css("display", "inline");
    $("#sal_bloc1").css("display", "none");
    $("#sal_bloc2").css("display", "none");
    $("#sal_bloc3").css("display", "none");
  } else if ($("#type_user").val() == "1" || $("#type_user").val() == "4") {
    $("#as").empty();
    $("#as").css("display", "none");
    $("#secteur").css("display", "none");
    $("#sal_bloc1").css("display", "none");
    $("#sal_bloc2").css("display", "none");
    $("#sal_bloc3").css("display", "none");
  } else {
    if (
      $.cookie("group") == "Agent secteur" ||
      $.cookie("group") == "Agent constat" ||
      $.cookie("group") == "Audit planneur"
    ) {
      getClient();
      $("#sal_bloc2").css("display", "inline");
      $("#sal_bloc3").css("display", "inline");
      $("#as").empty();
      $("#as").css("display", "none");
      $("#secteur").css("display", "none");
      $("#sal_bloc1").css("display", "inline");
    } else if ($.cookie("group") == "Client pro") {
      $("#sal_bloc2").css("display", "none");
    } else {
      $("#sal_bloc2").css("display", "none");
      $("#sal_bloc3").css("display", "none");
      $("#as").empty();
      $("#as").css("display", "none");
      $("#secteur").css("display", "none");
      $("#sal_bloc1").css("display", "none");
      $("#type_user").val("2");
      alert("Vous ne pouvez pas ajouter de salarié");
    }
  }
});
function getboyCl() {
  $.ajax({
    type: "GET",
    url: client_add + $("#client_val").val(),
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      $("#company").val(response[0]["societe"]);
    },
    error: function (response) {
      console.log(response);
    },
  });
}
function getAs(cas = 1, val = 1, val_ = "1") {
  var content = "";
  $.ajax({
    type: "GET",
    url: asurl_not_paginated,
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      //console.log(response)
      content =
        "<option value='0'>****************************************</option>";
      var r = "";
      if (typeof response["results"] === "undefined") {
        r = response;
      } else {
        r = response["results"];
      }
      r.forEach((elt) => {
        content =
          content +
          "<option value = " +
          elt["id"] +
          ">" +
          elt["user"]["nom"] +
          "  " +
          elt["user"]["prenom"] +
          "</option>";
      });
      if (cas != 1) {
        $("#as").empty();
        $("#as").append(
          " <label for='exampleInputEmail1'>Agent de secteur</label>\
                    <select disabled=''  class='form-select form-control form-select-lg' id='as_val'> " +
            content +
            "</select>"
        );
      } else {
        $("#as").empty();
        $("#as").append(
          " <label for='exampleInputEmail1'>Agent de secteur</label>\
                    <select class='form-select form-control form-select-lg' id='as_val'> " +
            content +
            "</select>"
        );
      }
      if (val != 1) {
        $("#as_val").val(val_).change();
      }
    },
    error: function (response) {
      console.log(response);
    },
  });
}

function getClient(cas = 0, val = "", val_ = 1) {
  var content = "";
  $.ajax({
    type: "GET",
    url: client_add,
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      //console.log(response)
      content =
        "<option value='0'>****************************************</option>";
      response.forEach((elt) => {
        content =
          content +
          "<option value = " +
          elt["id"] +
          ">" +
          elt["user"]["nom"] +
          "  " +
          elt["user"]["prenom"] +
          "</option>";
      });
      $("#client").empty();
      $("#client").append(
        " <label for='exampleInputEmail1'>Client</label>\
                    <select onchange='getboyCl()' class='form-select form-control form-select-lg' id='client_val'> " +
          content +
          "</select>"
      );
      if (cas == 1) {
        $("#client_val").val(val);
      }
      if (val_ != 1) {
        $("#client").empty();
        $("#client").append(
          " <label for='exampleInputEmail1'>Client</label>\
                    <select disabled='' class='form-select form-control form-select-lg' id='client_val'> " +
            content +
            "</select>"
        );
      }
    },
    error: function (response) {
      console.log(response);
    },
  });
}
function addUser() {
  //purification des erreurs du formulaire
  $("#error_form").css("display", "none");
  $("#s1_error").css("display", "none");
  $("#s2_error").css("display", "none");
  $("#as_error").css("display", "none");
  var url = "";
  var data = {};
  var tri = "";
  //controle des champs basic
  if (
    !$("#login").val() ||
    !$("#nom").val() ||
    !$("#prenom").val() ||
    !$("#mdp").val() ||
    !$("#email").val() ||
    !$("#adresse").val() ||
    !$("#telephone").val()
  ) {
    $("#error_form").css("display", "inline");
    return;
  }
  //chargement info basic de l'objet à POST
  data["nom"] = $("#nom").val();
  data["prenom"] = $("#prenom").val();
  data["login"] = $("#login").val();
  data["mdp"] = $("#mdp").val();
  data["email"] = $("#email").val();
  data["adresse"] = $("#adresse").val();
  data["telephone"] = $("#telephone").val();
  //generation trigramme
  tri = data["nom"][0] + data["prenom"][0] + data["prenom"][1];
  tri = tri.toUpperCase();
  //controle des champs seteur cas AS
  if ($("#type_user").val() == "1") {
    url = admin_add;
  }
  if ($("#type_user").val() == "2") {
    if (!$("#secteur_primaire").val()) {
      $("#s1_error").css("display", "inline");
      return;
    }
    if (!$("#secteur_secondaire").val()) {
      $("#s2_error").css("display", "inline");
      return;
    }
    data["role"] = 1;
    data["secteur_primaire"] = $("#secteur_primaire").val();
    data["secteur_secondaire"] = $("#secteur_secondaire").val();
    data["trigramme"] = tri;
    url = agent_add;
  }
  if ($("#type_user").val() == "4") {
    data["trigramme"] = tri;
    data["role"] = 3;
    url = agent_add;
  }
  //controle du champs AS cas AC CPRO CPART
  if (
    $("#type_user").val() == "3" ||
    $("#type_user").val() == "5" ||
    $("#type_user").val() == "6"
  ) {
    if ($("#as_val").val() == "0") {
      $("#as_error").css("display", "inline");
      return;
    }
    if ($.cookie("group") == "Administrateur") {
      data["agent_secteur"] = $("#as_val").val();
      data["agent_rattache"] = $("#as_val").val();
    }
    if (
      $.cookie("group") == "Agent secteur" ||
      $.cookie("group") == "Agent constat" ||
      $.cookie("group") == "Audit planneur"
    ) {
      data["agent_secteur"] = $.cookie("id_user_logged");
      data["agent_rattache"] = $.cookie("id_user_logged");
    }

    if ($("#type_user").val() == "3") {
      data["trigramme"] = tri;
      data["role"] = 2;
      url = agent_add;
    }
    if ($("#type_user").val() == "5") {
      data["type"] = 1;
      data["email_reponsable"] = $("#email").val();
      url = client_add;
    }
    if ($("#type_user").val() == "6") {
      data["type"] = 2;
      data["email_reponsable"] = $("#email").val();
      url = client_add;
    }
  }
  if ($("#type_user").val() == "7") {
    if ($.cookie("group") == "Client pro") {
      data["client"] = $.cookie("id_user_logged");
    } else {
      data["client"] = $("#client_val").val();
    }
    data["fonction"] = $("#fonction").val();
    data["mobile"] = $("#mobile").val();
    data["titre"] = $("#titre").val();
    data["code"] = $("#code").val();
    url = salarie_add;
  }

  $.ajax({
    type: "POST",
    url: url,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: data,
    success: function (response) {
      alert("Ajout okay");
      clearForm();
      window.location.replace("list.html");
    },
    error: function (response) {
      alert("Echec de l'ajout verifiez le nom d'utilisateur en doublon");
    },
  });
}
function clearForm() {
  $("#error_form").css("display", "none");
  $("#s1_error").css("display", "none");
  $("#s2_error").css("display", "none");
  $("#as_error").css("display", "none");
  $("#nom").val("");
  $("#prenom").val("");
  $("#login").val("");
  $("#mdp").val("");
  $("#email").val("");
  $("#adresse").val("");
  $("#telephone").val("");
  $("#trigramme").val("");
  $("#statut").val("1").change();
  $("#as").empty();
  $("#secteur").css("display", "none");
  $("#as").css("display", "none");
  $("#type_user").val("1");
}
$("#go").on("click", function () {
  addUser();
});
$("#leave").on("click", function () {
  clearForm();
});
function getUserToEdit() {
  toEdit = $.cookie("id_user_edit");
  Edition = parseInt($.cookie("road"));
  var url = "";
  $("#tri").css("display", "none");
  if (Edition == 1) {
    //cas agent
    url = agent_add + toEdit.toString();
  } else if (Edition == 2) {
    //cas admin
    url = admin_add + toEdit.toString();
  } else if (Edition == 3) {
    //cas client pro
    url = client_add + toEdit.toString();
  } else if (Edition == 4) {
    //cas client part
    url = client_add + toEdit.toString();
  } else {
    //cas salarié
    url = salarie_add + toEdit.toString();
  }
  $.ajax({
    type: "GET",
    url: url,
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      $("#role").val(response[0]["user"]["group"]);
      $("#boy").val("");
      $("#boy").val(response[0]["id"]);
      if (response[0]["user"]["is_active"] == true) {
        $("#statut").val("1").change();
      } else {
        $("#statut").val("0").change();
      }
      if (Edition == 1) {
        $("#tri").css("display", "inline");
        $("#cas").val(1);
        //cas AP AS AC
        $("#nom").val(response[0]["user"]["nom"]);
        $("#prenom").val(response[0]["user"]["prenom"]);
        $("#login").val(response[0]["user"]["login"]);
        $("#email").val(response[0]["user"]["email"]);
        $("#telephone").val(response[0]["telephone"]);
        $("#adresse").val(response[0]["adresse"]);
        $("#trigramme").val(response[0]["trigramme"]);
        if (response[0]["user"]["group"] == "Agent secteur") {
          $("#as").empty();
          $("#as").css("display", "none");
          $("#secteur_primaire").val(response[0]["secteur_primaire"]);
          $("#secteur_secondaire").val(response[0]["secteur_secondaire"]);
          $("#secteur").css("display", "inline");
        } else if (response[0]["user"]["group"] == "Agent constat") {
          //getAs()
          $("#secteur").empty();
          $("#secteur").css("display", "none");
          $("#as").css("display", "inline");
          getAs(2, 2, response[0]["agent_secteur"]);
        } else {
          $("#as").css("display", "none");
        }
      } else if (Edition == 2) {
        $("#cas").val(2);
        //cas administrateur
        $("#nom").val(response[0]["user"]["nom"]);
        $("#prenom").val(response[0]["user"]["prenom"]);
        $("#login").val(response[0]["user"]["login"]);
        $("#email").val(response[0]["user"]["email"]);
        $("#telephone").val(response[0]["telephone"]);
        $("#adresse").val(response[0]["adresse"]);
      } else if (Edition == 3) {
        $("#cas").val(3);
        //cas client Pro
        $("#complement_adresse").val(response[0]["complement_adresse"]);
        $("#nom").val(response[0]["user"]["nom"]);
        $("#prenom").val(response[0]["user"]["prenom"]);
        $("#login").val(response[0]["user"]["login"]);
        $("#email").val(response[0]["user"]["email"]);
        $("#telephone").val(response[0]["telephone"]);
        $("#adresse").val(response[0]["adresse"]);
        $("#titre").val(response[0]["titre"]);
        $("#code_postal").val(response[0]["code_postal"]);
        $("#ville").val(response[0]["ville"]);
        $("#societe").val(response[0]["societe"]);
        $("#reference_societe").val(response[0]["ref_societe"]);
        $("#siret").val(response[0]["siret"]);
        $("#tva_inter").val(response[0]["tva_intercommunautaire"]);
        $("#tel_agence").val(response[0]["telephone_agence"]);
        $("#email_agence").val(response[0]["email_agence"]);
        $("#code").val(response[0]["code_client"]);
        $("#fonction").val(response[0]["fonction"]);
        //$('#statut').val(response[0]["statut_client"])
        $("#mobile").val(response[0]["mobile"]);
        //info concession
        $("#secteur").val(
          response[0]["info_concession"]["agent_rattache"]["secteur"] +
            " " +
            response[0]["info_concession"]["agent_rattache"][
              "secteur_secondaire"
            ]
        );
        $("#nom_concessionanire").val(
          response[0]["info_concession"]["nom_concessionnaire"]
        );
        $("#suive_technique").val(
          response[0]["info_concession"]["suivie_technique_client"]
        );
        $("#origine_client").val(
          response[0]["info_concession"]["origine_client"]
        );
        $("#numero_proposition").val(
          response[0]["info_concession"]["numero_proposition_prestation"]
        );
        $("#asclient").val(response[0]["info_concession"]["as_client"]);
        //info compta
        if (response[0]["ref_comptable"] != null) {
          $("#nom_comptable").val(response[0]["ref_comptable"]["nom"]);
          $("#mobile_comptable").val(response[0]["ref_comptable"]["mobile"]);
          $("#email_envoi_facture").val(
            response[0]["ref_comptable"]["email_envoi_facture"]
          );
          $("#telephone_comptable").val(
            response[0]["ref_comptable"]["telephone"]
          );
        }

        //info gestion
        if (response[0]["ref_service_gestion"] != null) {
          $("#nom_gestionnaire").val(
            response[0]["ref_service_gestion"]["nom_complet"]
          );
          $("#mobile_service_gestion").val(
            response[0]["ref_service_gestion"]["mobile"]
          );
          $("#email_gestionnaire").val(
            response[0]["ref_service_gestion"]["email"]
          );
          $("#telephone_service_gestion").val(
            response[0]["ref_service_gestion"]["telephone"]
          );
        }
        getAs(2);
        $("#as").css("display", "inline");
        getAs(2, 2, response[0]["info_concession"]["agent_rattache"]["id"]);
      } else if (Edition == 4) {
        $("#cas").val(4);
        //client part
        $("#nom").val(response[0]["user"]["nom"]);
        $("#prenom").val(response[0]["user"]["prenom"]);
        $("#login").val(response[0]["user"]["login"]);
        $("#email").val(response[0]["user"]["email"]);
        $("#telephone").val(response[0]["telephone"]);
        $("#adresse").val(response[0]["adresse"]);
        $("#titre").val(response[0]["titre"]);
        $("#code_postal").val(response[0]["code_postal"]);
        $("#ville").val(response[0]["ville"]);
        //$('#code').val(response[0]['code_client'])
        $("#complement_adresse").val(response[0]["complement_adresse"]);
        $("#secteur").val(
          response[0]["info_concession"]["agent_rattache"]["secteur"] +
            " " +
            response[0]["info_concession"]["agent_rattache"][
              "secteur_secondaire"
            ]
        );
        $("#nom_concessionanire").val(
          response[0]["info_concession"]["nom_concessionnaire"]
        );
        $("#suivie_technique").val(
          response[0]["info_concession"]["suivie_technique_client"]
        );
        $("#origine_client").val(
          response[0]["info_concession"]["origine_client"]
        );
        $("#numero_proposition").val(
          response[0]["info_concession"]["numero_proposition_prestation"]
        );
        $("#asclient").val(response[0]["info_concession"]["as_client"]);
        //$('#statut').val(response[0]["statut_client"])
        $("#mobile").val(response[0]["mobile"]);
        getAs(2, 2, response[0]["info_concession"]["agent_rattache"]["id"]);
        $("#as").css("display", "inline");
      } else {
        //cas Salarie
        $("#cas").val(5);
        $("#nom").val(response[0]["user"]["nom"]);
        $("#prenom").val(response[0]["user"]["prenom"]);
        $("#login").val(response[0]["user"]["login"]);
        $("#email").val(response[0]["user"]["email"]);
        $("#telephone").val(response[0]["telephone"]);
        $("#adresse").val(response[0]["adresse"]);
        $("#titre").val(response[0]["titre"]);
        $("#fonction").val(response[0]["fonction"]);
        $("#mobile").val(response[0]["mobile"]);
        $("#code").val(response[0]["code"]);
        $("#company").val(response[0]["compani"]);
        getClient(1, response[0]["client"]["id"]);
        $("#sal_bloc2").css("display", "inline");
        $("#sal_bloc3").css("display", "inline");
        $("#as").empty();
        $("#as").css("display", "none");
        $("#secteur").css("display", "none");
        $("#sal_bloc1").css("display", "inline");
      }
    },
    error: function (response) {
      console.log(response);
    },
  });
}

function editUser(cas, prof = 0) {
  var id = "";
  id = $("#boy").val();
  if (prof != 0) {
    id = $.cookie("id_user_logged");
  }
  var url = "";
  var data = {};

  if (cas == 1) {
    //cas agent
    url = agent_add + id.toString();
  } else if (cas == 2) {
    //cas admin
    url = admin_add + id.toString();
  } else if (cas == 3) {
    //cas client pro
    url = client_add + id.toString();
  } else if (cas == 4) {
    //cas client part
    url = client_add + id.toString();
  } else {
    //cas salarié
    url = salarie_add + id.toString();
  }

  if (
    !$("#login").val() ||
    !$("#nom").val() ||
    !$("#prenom").val() ||
    !$("#email").val() ||
    !$("#adresse").val() ||
    !$("#telephone").val()
  ) {
    $("#error_form").css("display", "inline");
    return;
  }
  data["nom"] = $("#nom").val();
  data["prenom"] = $("#prenom").val();
  data["login"] = $("#login").val();
  data["mdp"] = $("#mdp").val();
  data["email"] = $("#email").val();
  data["adresse"] = $("#adresse").val();
  data["telephone"] = $("#telephone").val();
  data["is_active"] = $("#statut").val();
  //cas Admin

  //cas des agents
  if (cas == 1) {
    // Cas Agent de secteur AS
    if ($("#role").val() == "Agent secteur") {
      if (!$("#secteur_primaire").val()) {
        $("#s1_error").css("display", "inline");
        return;
      }
      if (!$("#secteur_secondaire").val()) {
        $("#s2_error").css("display", "inline");
        return;
      }
      data["secteur_primaire"] = $("#secteur_primaire").val();
      data["secteur_secondaire"] = $("#secteur_secondaire").val();
      data["role"] = 1;
      data["trigramme"] = $("#trigramme").val();
    }
    if (
      $("#role").val() == "Agent constat" ||
      $("#role").val() == "Audit planneur"
    ) {
      if ($("#as_val").val() == "0") {
        $("#as_error").css("display", "inline");
        return;
      }
      data["agent_secteur"] = $("#as_val").val();
      data["trigramme"] = $("#trigramme").val();
    }
    if ($("#role").val() == "Agent constat") {
      data["role"] = 2;
    }
    if ($("#role").val() == "Audit planneur") {
      data["role"] = 3;
    }
  }
  //cas des clients pro
  if (cas == 3) {
    data["type"] = 1;
    data["email_reponsable"] = $("#email").val();
    data["is_active"] = parseInt($("#statut").val());
    data["adresse"] = $("#adresse").val();
    data["code_client"] = $("#code").val();
    data["nom_complet_comptable"] = $("#nom_comptable").val();
    data["email_envoi_facture"] = $("#email_envoi_facture").val();
    data["telephone_comptable"] = $("#telephone_comptable").val();
    data["mobile_comptable"] = $("#mobile_comptable").val();
    data["nom_complet_contact"] = $("#nom_gestionnaire").val();
    data["email_service_gestion"] = $("#email_gestionnaire").val();
    data["telephone_service_gestion"] = $("#telephone_service_gestion").val();
    data["mobile_service_gestion"] = $("#mobile_service_gestion").val();
    data["agent_rattache"] = $("#as_val").val();
    data["agence_secteur_rattachement"] = $("#secteur").val();
    data["nom_concessionnaire"] = $("#nom_concessionanire").val();
    data["numero_proposition_prestation"] = $("#numero_proposition").val();
    data["as_client"] = $("#asclient").val();
    data["origine_client"] = $("#origine_client").val();
    data["suivie_technique_client"] = $("#suive_technique").val();
    data["statut_client"] = $("#statut").val();
    data["titre"] = $("#titre").val();
    data["fonction"] = $("#fonction").val();
    data["societe"] = $("#societe").val();
    data["ref_societe"] = $("#reference_societe").val();
    data["email_agence"] = $("#email_agence").val();
    data["siret"] = $("#siret").val();
    data["tva_intercommunautaire"] = $("#tva_inter").val();
    data["complement_adresse"] = $("#complement_adresse").val();
    data["code_postal"] = $("#code_postal").val();
    data["ville"] = $("#ville").val();
    data["mobile"] = $("#mobile").val();
    data["telephone_agence"] = $("#tel_agence").val();
  }
  //cas client Part
  if (cas == 4) {
    data["type"] = 2;
    data["email_reponsable"] = $("#email").val();
    data["is_active"] = parseInt($("#statut").val());
    data["adresse"] = $("#adresse").val();
    //data["code_client"] = $('#code').val()
    data["agent_rattache"] = $("#as_val").val();
    data["agence_secteur_rattachement"] = $("#secteur").val();
    data["nom_concessionnaire"] = $("#nom_concessionanire").val();
    data["numero_proposition_prestation"] = $("#numero_proposition").val();
    data["as_client"] = $("#asclient").val();
    data["origine_client"] = $("#origine_client").val();
    data["suivie_technique_client"] = $("#suive_technique").val();
    data["statut_client"] = $("#statut").val();
    data["titre"] = $("#titre").val();
    data["complement_adresse"] = $("#complement_adresse").val();
    data["code_postal"] = $("#code_postal").val();
    data["ville"] = $("#ville").val();
    data["mobile"] = $("#mobile").val();
    data["telephone_agence"] = $("#tel_agence").val();
  }
  //cas salarié
  if (cas == 5) {
    if ($.cookie("group") == "Client pro") {
      data["client"] = $.cookie("id_user_logged");
    } else {
      data["client"] = $("#client_val").val();
    }
    data["fonction"] = $("#fonction").val();
    data["mobile"] = $("#mobile").val();
    data["titre"] = $("#titre").val();
    data["code"] = $("#code").val();
    url = salarie_add + id.toString();
  }
  $.ajax({
    type: "PUT",
    url: url,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: data,
    success: function (response) {
      alert("Modification okay");
      clearForm();
      window.location.replace("list.html");
    },
    error: function (response) {
      console.log(response);
      alert("Echec de l'ajout");
    },
  });
}

$("#goEdit").on("click", function () {
  var cas = parseInt($("#cas").val());
  editUser(cas);
});
$("#LeaveEdit").on("click", function () {
  window.location.replace("list.html");
});

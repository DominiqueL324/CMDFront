function getAgentManage(as,ap){
    var content=""
    $.ajax({
        type: 'GET',
        url: asurl_not_paginated,
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            //console.log(response)
            content = "<option value='0'>****************************************</option>"
            response.forEach(elt => {
                 content = content + "<option value = " + elt['user']['id'] + ">" + elt['user']['nom'] + "  " + elt['user']['prenom'] + "</option>"
            });

            
          
            $('#planneur_select').empty()
            $('#planneur_select').append(
                " <label for='planneur'>Planneur</label>\
                <select   class='form-select form-control form-select-lg' id='planneur_val'> "+ content + "</select>"
            )
    
            $('#passeur_select').empty()
            $('#passeur_select').append(
                " <label for='exampleInputEmail1'>Agent de secteur</label>\
                <select class='form-select form-control form-select-lg' id='constat_val'> "+ content + "</select>"
            )
            if($.cookie("group")=="Client pro" || $.cookie("group")=="Client particulier" ){
                $('#constat_val').prop("disabled",true)
                $('#planneur_val').prop("disabled",true)
            }
            if(as!=null){
                $('#constat_val').val(as).change();
            }
            if(ap!=null){
                $('#planneur_val').val(ap).change();
            }     
        },
        error:function(response){ 
            console.log(response) 
        } 
    })
}
function getRdvToEditP(){
    $.ajax({
        type: 'GET',
        url: rdv_add+$.cookie('rdv_to_edit').toString(),
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            $('#nom_bailleur').val(response[0]["propriete"]["bailleur"]["nom"])
            $('#prenom_bailleur').val(response[0]["propriete"]["bailleur"]["prenom"])
            $('#email_bailleur').val(response[0]["propriete"]["bailleur"]["email"])
            $('#reference_bailleur').val(response[0]["propriete"]["bailleur"]["reference"])
            $('#nom_locataire').val(response[0]["propriete"]["locataire"]["nom"])
            $('#prenom_locataire').val(response[0]["propriete"]["locataire"]["prenom"])
            $('#email_locataire').val(response[0]["propriete"]["locataire"]["email"])
            $('#telephone_locataire').val(response[0]["propriete"]["locataire"]["telephone"])
            $('#surface_propriete').val(response[0]["propriete"]["surface"])
            $('#numero_propriete').val(response[0]["propriete"]["numero"])
            $('#numero_parking_propriete').val(response[0]["propriete"]["numeroParking"])
            $('#adresse_propriete').val(response[0]["propriete"]["adresse"])
            $('#code_postal_propriete').val(response[0]["propriete"]["codePostal"])
            $('#ville_propriete').val(response[0]["propriete"]["ville"])
            $('#adresse_complementaire_propriete').val(response[0]["propriete"]["adresseComplementaire"])
            $('#numero_cave_propriete').val(response[0]["propriete"]["numeroCave"])
            $('#numero_sol_propriete').val(response[0]["propriete"]["numeroSol"])
            $('#ref_lot').val(response[0]["ref_lot"])
            var formattedDate = new Date(response[0]["date"]).toJSON().slice(0,19)
            var time_ = new Date(response[0]["date"]).toISOString().split('T')[1];
            $('#date').val(formattedDate)
            $('#date_plan').val(formattedDate)
            //$('#heure').val(time_.split('Z')[0])
            
            $('#ref_edl').val(response[0]["ref_rdv_edl"])
            $('#adresse_ancien_locataire').val(response[0]["propriete"]["ancien_locataire"])
            getInterventionandPropriete(1,val_=response[0]['intervention']["id"],response[0]["propriete"]['type_propriete']["id"])
            $('#type').val(response[0]["propriete"]['type'])
            $('#consignes_part').val(response[0]["consignes_particuliere"])
            $('#list_documents').val(response[0]["liste_document_recuperer"])
            $('#info_diverses').val(response[0]["info_diverses"])
            if(response[0]["client"]!=null){
                getClient(response[0]["client"]["id"],val_=1)
            }
            if(response[0]["passeur"]!=null){
                getPasseur(cas=response[0]["passeur"][0]["user"]['id'])
            }else{
                getPasseur(cas=0)
            }
            if(response[0]["agent"]!=null){
                getAgent(cas=1,val_=response[0]["agent"]["user"]["id"])
            }else{
                getAgent(cas=1,val_=0)
            }
            if(response[0]["audit_planneur"]!=null){
                $('#planneur').val(response[0]["audit_planneur"]["user"]["nom"]+" "+response[0]["audit_planneur"]["user"]["prenom"])
            }
            if(response[0]["agent_constat"]!=null){
                $('#constat').val(response[0]["agent_constat"]["user"]["nom"]+" "+response[0]["agent_constat"]["user"]["prenom"])
            }
            $('#steps').empty()
            if(parseInt(response[0]["statut"])==1){
                
                $('#steps').progressbar({
                    steps: ['@En attente de prise en charge','Prise en charge attente horaire','Action requise','Organisé']
                });
            } 
            if(parseInt(response[0]["statut"])==2){
                $('#steps').progressbar({
                    steps: ['En attente de prise en charge','@Prise en charge attente horaire','Action requise','Organisé']
                });
            }
            if(parseInt(response[0]["statut"])==3){
                $('#steps').progressbar({
                    steps: ['En attente de prise en charge','Prise en charge attente horaire','@Action requise','Organisé']
                });
            }
            if(parseInt(response[0]["statut"])==4){
                $('#steps').progressbar({
                    steps: ['En attente de prise en charge','Prise en charge attente horaire','Action requise','@Organisé']
                });
            }
            var ap=""
            var as=""
            if(response[0]["audit_planneur"] == null){
                ap = null 
            }else{
                ap = response[0]["audit_planneur"]["user"]["id"]  
            }
            if(response[0]["agent_constat"]==null){
                as = null 
            }else{
                as = response[0]["agent_constat"]["user"]["id"]  
            }
            getAgentManage(as,ap)
            getCommentaires()
            //getFiles()
            $('#statut').val(parseInt(response[0]["statut"]).toString()).change();  
            if($.cookie("group")=="Client pro" || $.cookie("group")=="Client particulier"){
                $('#statut').prop("disabled",true)
                if(parseInt(response[0]["statut"])!=1){
                    $('#pied').css('display','none')
                    $('#piedDate').css('display','none')
                    $('#btnPlanneur').css('display','none')
                    
                }
            }else{
                $('#pied').css('display','inline')
                $('#piedDate').css('display','inline')
                $('#btnPlanneur').css('display','inline')
            } 
            if($.cookie("group")=="Salarie"){
                $('#statut').prop("disabled",true)
                $('#pied').css('display','none')
                $('#piedDate').css('display','none')
                $('#btnPlanneur').css('display','none')
            }       
        },
        error:function(response){ 
            console.log(response) 
        } 
    })
}
function getCommentaires(){
    $.ajax({
        type: 'GET',
        url: "http://195.15.218.172/rdv_app/rdv/comments/",
        data: {"rdv":$.cookie('rdv_to_edit')},
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            $('idComment').val("")
            $('#contentTableComments').empty()
            console.log(response)
            response.forEach(elt => {
                var formattedDate = new Date(elt["date"]);
                var d = formattedDate.getDate();
                var m =  formattedDate.getMonth();
                m += 1;  // JavaScript months are 0-11
                var y = formattedDate.getFullYear();
                $('#contentTableComments').append(
                    '<tr>\
                        <td></td>\
                        <td>'+ elt["user"]['first_name']+" "+elt['user']['first_name']+'</td>\
                        <td>'+ elt["contenu"]+'</td>\
                        <td>'+ String(d).padStart(2, '0') + "/" + String(m).padStart(2, '0') + "/" + y +'</td>\
                        <td>\
                            <a  onclick=\'getCommentToedit ('+ elt["id"] +')\' ><i class="bi bi-pencil-square"style="color: rgb(0, 0, 0)"></i></a>\
                        </td>\
                        <td></td>\
                    </tr>'
                )
                   
            });
            
        },
        error:function(response){ 
            console.log(response) 
        } 
    })
}
function sendCommend(){
    var method=""
    var url =""
    var data = {}
    data['user'] = $.cookie('id_logged_user_user')
    data['rdv'] = $.cookie('rdv_to_edit')
    data['comment'] = $('#comentaire').val()
    if(!$('idComment').val()){
        method = "POST"
        url = commentaires_app
    }else{
        method= "PUT"
        url = commentaires_app+$('idComment').val().toString()
    }
    $.ajax({
        type: method,
        url: "http://195.15.218.172/rdv_app/rdv/comments/",
        data: data,
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            alert("Opération sur le commentaire effectuée avec succè")
            getCommentToedit()
            $('#comentaire').val("")
            $('idComment').val("")
        } 
    })
}
$('#goCommentaire').on('click',function(){
    sendCommend()
})
function getCommentToedit(id){
    $.ajax({
        type: 'GET',
        url: commentaires_app+id.toISOString(),
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            
            $('#contentTableComments').empty()
            response['results'].forEach(elt => {
                $('comentaire').val(results[0]["contenu"])
                $('idComment').val(results[0]["id"])
            });
            
        },
        error:function(response){ 
            console.log(response) 
        } 
    })  
}
function getFiles(){
    $.ajax({
        type: 'GET',
        url: files_app,
        data: {"rdv":$.cookie('rdv_to_edit')},
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            $('idFichier').val("")
            $('#contentTableFile').empty()
            response.forEach(elt => {
                var formattedDate = new Date(elt["date"]);
                var d = formattedDate.getDate();
                var m =  formattedDate.getMonth();
                m += 1;  // JavaScript months are 0-11
                var y = formattedDate.getFullYear();
                $('#contentTableFile').append(
                    '<tr>\
                        <td></td>\
                        <td>'+ elt['user']['first_name']+" "+elt['user']['last_name']+'</td>\
                        <td>'+ elt["nom"]+'</td>\
                        <td>'+ elt["type"]+'</td>\
                        <td>'+ String(d).padStart(2, '0') + "/" + String(m).padStart(2, '0') + "/" + y +'</td>\
                        <td>\
                            <a  href=\' '+ elt["route"] +'\' ><i class="bi bi-pencil-square"style="color: rgb(0, 0, 0)"></i></a>\
                        </td>\
                    </tr>'
                )
            });
            
        },
        error:function(response){ 
            alert("Echec de récupération des fichiers")
            console.log(response) 
        } 
    })
}
function sendFile(){
    var data = {}
    data['user_id'] = $.cookie('id_logged_user_user')
    data['rdv_id'] = $.cookie('rdv_to_edit')
    data['type'] = $('#typeF').val()
    data['fichier'] = $('#doc').val()
    data['raison'] = $('#raison').val()
    $.ajax({
        type: 'POST',
        url: files_app,
        data: data,
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            alert("Ajout du fichier okay")
            getFiles()
            $('#raison').val("")
            $('#doc').val("photo")

        } 
    })

}
$('#goFile').on('click',function(){
    sendFile()
})
$('#goEditRdv').on("click",function(){
    data={}
    data["nom_bailleur"] = $('#nom_bailleur').val()
    data["prenom_bailleur"] = $('#prenom_bailleur').val()
    data["email_bailleur"] = $('#email_bailleur').val()
    data["reference_bailleur"] = $('#reference_bailleur').val()
    data["nom_locataire"] = $('#nom_locataire').val()
    data["prenom_locataire"] = $('#prenom_locataire').val()
    data["email_locataire"] = $('#email_locataire').val()
    data["telephone_locataire"] = $('#telephone_locataire').val()
    data["surface_propriete"] = $('#surface_propriete').val()
    data["numero_propriete"] = $('#numero_propriete').val()
    data["numero_parking_propriete"] = $('#numero_parking_propriete').val()
    data["adresse_propriete"] = $('#adresse_propriete').val()
    data["code_postal_propriete"] = $('#code_postal_propriete').val()
    data["ville_propriete"] = $('#ville_propriete').val()
    data["adresse_complementaire_propriete"] = $('#adresse_complementaire_propriete').val()
    data["numero_cave_propriete"] = $('#numero_cave_propriete').val()
    data["numero_sol_propriete"] = $('#numero_sol_propriete').val()
    data["ref_lot"] = $('#ref_lot').val() 
    data["ref_edl"] = $('#ref_edl').val()
    data['ancien_locataire'] = $('#adresse_ancien_locataire').val()
    data["intervention"] = $('#intervention_val').val()
    data["statut"] = $('#statut').val()
    data["date"] = $('#date').val()
    if($.cookie('group')=="Agent secteur" || $.cookie('group')=="Agent constat" || $.cookie('group')=="Audit planneur" || $.cookie('group')=="Administrateur"){
        data['client'] = $('#client_val').val()
    }
    
    if($.cookie('group')=="Client pro" || $.cookie('group')=="Client particulier" || $.cookie('group')=="Agent secteur" || $.cookie('group')=="Agent constat" || $.cookie('group')=="Audit planneur" || $.cookie('group')=="Administrateur"){
        if(!$("#passeur_val").val() || $("#passeur_val").val() == "0"){

        }else{
            data['passeur'] = $('#passeur_val').val()
        }
    }
    if($.cookie('group')=="Agent secteur" || $.cookie('group')=="Agent constat" || $.cookie('group')=="Audit planneur"){
        data['agent'] = $.cookie('id_user_logged')
    }
    if($.cookie('group')=="Administrateur"){
        data['agent'] = $('#agent_val').val()
    }
    if($.cookie('group')=="Client pro" || $.cookie('group')=="Client particulier" || $.cookie('group')=="Salarie"){
        data['agent'] = $.cookie('id_logged_user_user')
    }
    data["type_propriete"] = $('#propriete_val').val()
    data["type"] = $('#type').val()
    data["consignes_part"] = $('#consignes_part').val()
    data["list_documents"] = $('#list_documents').val()
    data["info_diverses"] = $('#info_diverses').val()
    
    if($.cookie('group')=="Client pro" || $.cookie('group')=="Client particulier"){
        data['client'] = $.cookie('id_user_logged')
    }
    if($.cookie('group')=="Salarie"){
        data['passeur'] = $.cookie('id_logged_user_user')
    }

    $.ajax({
        type: 'PUT',
        url: rdv_add+$.cookie('rdv_to_edit').toString(),
        data:data,
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            alert('RDV Modifié avec succes')
            getRdvToEditP()
        },
        error:function(response){ 
            console.log(response) 
        } 
    })
})
$('#goPlanneur').on('click',function(){
    if(parseInt($("#planneur_val").val())==0 || parseInt($("#constat_val").val())==0){
        alert("Vous devez obligatoirement remplir un planneur et un gent de constat")
        return
    }
    $.ajax({
        type: 'PUT',
        url: rdv_add+$.cookie('rdv_to_edit').toString(),
        data: {"audit_planneur":$("#planneur_val").val(),"agent_constat":$("#constat_val").val(),"cas":"management"},
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            alert("Proposition éffectuée avec succès")
        },
        error: function(response){
            alert("Echec de proposition reéssayez plus tard")
        }
    })
})

$('#goDate').on('click',function(){
    if(!$("#date_plan").val()){
        alert("L'horaire est obligatoire")
        return
    }
    $.ajax({
        type: 'PUT',
        url: rdv_add+$.cookie('rdv_to_edit').toString(),
        data: {"date":$("#date_plan").val(),'final':"okay"},
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            alert("Horaire Mise à jour avec succès")
            getRdvToEditP()
        },
        error: function(response){
            alert("Echec de proposition reéssayez plus tard")
        }
    })
})
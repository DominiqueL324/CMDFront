function filtreRdv(){
    data={}
    message = "Rendez-vous "
    if($('#etat').val()!="0"){
        data['etat'] = $('#etat').val()
        message = message+"statut: "+$( "#etat option:selected" ).text()
    }
    if($('#role').val()!=0){
        data['role'] = $('#role').val() 
        message = message+" role: "+$( "#role option:selected" ).text()
    }
    if(!$('#debut').val()){
        data['debut'] = $('#debut').val() 
        var formattedDate = new Date($('#debut').val());
        var d = formattedDate.getDate();
        var m =  formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        var y = formattedDate.getFullYear();
        message = message+" date debut: "+ String(d).padStart(2, '0') + "/" + String(m).padStart(2, '0') + "/" + y 
    }
    if(!$('#fin').val()){
        data['fin'] = $('#fin').val()
        var formattedDate = new Date($('#fin').val());
        var d = formattedDate.getDate();
        var m =  formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        var y = formattedDate.getFullYear();
        message = message+" date fin: "+ String(d).padStart(2, '0') + "/" + String(m).padStart(2, '0') + "/" + y
    }
    if($('#client_val').val()!=0){
        data['client_val'] = $('#client_val').val() 
        message = message+" date client: "+$( "#client_val option:selected" ).text()
    }
    $.ajax({
        type: 'GET',
        url: rdv_add,
        headers: {
            'Authorization':"Bearer "+token
        },
        data:data,
        success: function(response){
            response['results'].forEach(elt => {
                var formattedDate = new Date(elt["date"]);
                var d = formattedDate.getDate();
                var m =  formattedDate.getMonth();
                m += 1;  // JavaScript months are 0-11
                var y = formattedDate.getFullYear();
                var couleur
                if(parseInt(elt["statut"]) ==1){
                    couleur = 'rgb(241, 67, 67)' 
                }
                if(parseInt(elt["statut"]) ==2){
                    couleur = 'rgb(255, 166, 93)' 
                }
                if(parseInt(elt["statut"]) ==3){
                    couleur = 'rgb(93, 182, 255)' 
                }
                if(parseInt(elt["statut"]) ==4){
                    couleur = 'rgb(93, 255, 101)' 
                }
                
                $('#contentTableRdv').append(
                    '<tr style="background-color:'+couleur+'; color:white;">\
                        <td>'+i+'</td>\
                        <td>'+ String(d).padStart(2, '0') + "/" + String(m).padStart(2, '0') + "/" + y +'</td>\
                        <td>'+ elt["client"]['societe']+'</td>\
                        <td>'+ elt['ref_lot']+'</td>\
                        <td>'+ elt['ref_rdv_edl']+'</td>\
                        <td class="text-center">\
                            <span class="badge badge-success">'+elt["intervention"]["type"]+'</span>\
                        </td>\
                        <td class="text-center">\
                            <span class="badge badge-primary">'+elt["propriete"]["type_propriete"]["type"]+'</span>\
                        </td>\
                        <td>\
                            <a  onclick=\'goWhereEdit('+ elt["id"] +')\' ><i class="bi bi-pencil-square"style="color: rgb(0, 0, 0)"></i></a>&nbsp;<a onclick=\'goWhereEdit1('+ elt["id"] +')\'><i class="fa fa-calendar" aria-hidden="true" style="color: rgb(136, 102, 119)"></i></a>\
                        </td>\
                    </tr>'
                )
                $('#text_ok').text(message)
                i++
                
            });

        },
        error: function(response){
            alert("Echec de récupération des rendez-vous")
        }
    })
}
$('#goSearch').on('click',function(){
    filtreRdv()
})
function getClientF(){
    var content=""
    if($.cookie("group")=="Administrateur" || $.cookie("group")=="Agent secteur" || $.cookie("group")=="Agent constat" || $.cookie("group")=="Audit planneur"){
        $.ajax({
            type: 'GET',
            url: client_add_not_pg,
            headers: {
                'Authorization':"Bearer "+token
            },
            success: function(response){
                content = "<option value='0'>***********************</option>"
                var r = ""
                if(typeof(response['results'])==='undefined'){
                    r = response
                }else{
                    r = response['results']
                }
                r.forEach(elt => {
                     content = content + "<option value = " + elt['id'] + ">"+ elt['societe'] +" --- " +elt['user']['nom'] +" " + elt['user']['prenom'] + "</option>"
                });
                $('#client').empty()
                $('#client').append(
                        "<select  class='form-select form-control form-select-lg' id='client_val'> "+ content + "</select>"
                )
            },
            error:function(response){ 
                console.log(response) 
            } 
        })
    }
    if($.cookie("group")=="Client particulier" || $.cookie("group")=="Client pro"){
        content = "<option value='0'>***********************</option>"
        content = content + "<option value = " + $.cookie('id_user_logged') + ">" +$.cookie('name') + " " + $.cookie('first_name') + "</option>"
        $('#client').empty()
        $('#client').append("<select  class='form-select form-control form-select-lg' id='client_val'> "+ content + "</select>")
    }
    if($.cookie("group")=="Salarie"){
        content = "<option value='0'>***********************</option>"
        content = content + "<option value = " + $.cookie('id_client_sal') + ">" +$.cookie('nom_client_sal') + " " + $.cookie('prenom_client_sal') + "</option>"
        $('#client').empty()
        $('#client').append("<select  class='form-select form-control form-select-lg' id='client_val'> "+ content + "</select>")
    }
}
 
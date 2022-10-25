var Url = "http://127.0.0.1:8000"
function login(){
    $('#login_error').css('display','none')
    $.ajax({
        type: 'POST',
        url: Url+"/manager_app/login/",
        data: {"username":$('#username').val(),"password":$('#password').val()},
        success: function(response){
            $.cookie('agent_user_logged') //to set
            $.cookie('name', response["user"]["nom"])
            $.cookie('id_logged_user_user', response["user"]["id"])
            $.cookie('first_name', response["user"]["prenom"])
            $.cookie('email', response["user"]["email"])
            $.cookie('group', response["user"]["group"])
            $.cookie('id_user_logged', response["id"])
            $.cookie('token', response["tokens"]["access"])
            $.cookie('refresh', response["tokens"]["refresh"])
            if($.cookie("group") == "Client pro" || $.cookie("group") == "Client particulier"){
                if(response["info_concession"] != null && response["info_concession"]["agent_rattache"] != null ){
                    $.cookie("id_agent",response["info_concession"]["agent_rattache"]['id'])
                    var nom = response["info_concession"]["agent_rattache"]['nom']+" "+response["info_concession"]["agent_rattache"]['prenom']
                    $.cookie("nom_agent",nom)
                    $.cookie("id_user_agent",response["info_concession"]["agent_rattache"]['user'])
                }else{
                    $.cookie("id_agent","vide")
                    $.cookie("nom_agent","vide")
                }   
            }
            if($.cookie("group") == "Salarie"){
                
                if(response["client"]!=null){
                    
                    $.cookie("id_client_sal",response["client"]["id"])
                    alert($.cookie("id_client_sal"))
                    $.cookie("nom_client_sal",response["client"]["nom"])
                    $.cookie("prenom_client_sal",response["client"]["prenom"])
                    $.cookie("societe_client_sal",response["client"]["societe"])
                    $.cookie("id_user_agent",response["client"]["agent_user"])
                }
                else{
                    $.cookie("id_client_sal",0)
                    $.cookie("nom_client_sal",0)
                    $.cookie("societe_client_sal",0)
                    $.cookie("id_user_agent",0)
                }
                //id de l'agent du client responsable de ce salarié
            }
            window.location.replace("dashboard.html")
        },
        error: function(response){
            $('#login_error').css('display','inline')
        }
    })
}

function logout(){
    $.cookie('name',null)
    $.cookie('first_name',null)
    $.cookie('email',null)
    $.cookie('group',null)
    $.cookie('id_user_logged',null)
    $.cookie('token',null)
    $.cookie('refresh',null)
    $.ajax({
        type: 'GET',
        url: Url+"/manager_app/logout/",
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            //$('#user_link').css("display","none")
            window.location.replace("login.html")
        },
        error: function(response){

        }
    })
}
$('#logout').on('click',function(){
    logout()
})
function checkLoged(){
    if($.cookie('token') == "null" || $.cookie('refresh') == "null"){
        window.location.replace("login.html")
    }
}

function loadNav(){
    var text = "Bienvenue "+$.cookie("first_name")+" "+$.cookie("name")
    $("#name_user").text(text)
    
    if($.cookie('group') == "Administrateur"){

    }
    if($.cookie('group') == "Salarie"){
        $('#user_link').empty()
        $('#user_link').css("display","none")
        $('#param_link').empty()
        $('#param_link').css("display","none")
    }
    if($.cookie('group') == "Client pro"){
        $('#users_add').empty()
        $('#users_add').append('<label for="exampleInputEmail1">Role</label>\
        <select class="form-control undefined" name="role" id="type_user">\
          <option value="7">Salarie</option>\
        </select>')
        $('#param_link').empty()
        $('#param_link').css("display","none")
    }
    if($.cookie('group') == "Client particulier"){
        $('#user_link').empty()
        $('#user_link').css("display","none")
        $('#param_link').empty()
        $('#param_link').css("display","none")
    }
    if($.cookie('group') == "Agent constat" || $.cookie('group') == "Agent secteur" || $.cookie('group') == "Audit planneur"){
        $('#param_link').empty()
        $('#param_link').css("display","none")
    }
}
$("#goLogin").on('click',function(){
    login()
})
var Url = "http://127.0.0.1:8000"
function getData(){
    $('#pass_error').css('display','none')
    $.ajax({
        type: 'GET',
        url: Url+"/manager_app/backup/password/",
        data:{"email":$('#email').val()},
        success: function(response){
            $.cookie("email_to_backup",response['email'])
            $.cookie("nom_to_backup",response['last_name'])
            $.cookie("prenom_to_backup",response['first_name'])
            window.location.replace("pass1.html")
        },
        error: function(response){
            console.log(response)
            $('#pass_error').css('display','inline')
        }
    })
}
$("#goPass").on("click",function(){
    getData()
})

function resetPass(){
    $.ajax({
        type: 'POST',
        url: Url+"/manager_app/backup/password/",
        data:{"email":$("#email").val()},
        success: function(response){
            alert("Mot de passe recupérer avec succès vérifiez votre boite mail")
            window.location.replace("login.html")
        },
        error: function(response){
            alert("Echec de récupération")
            $('#pass_error').css('display','inline')
        }
    })
}

$("#goPass1").on("click",function(){
    resetPass()
})
function fillForm(){
    $("#nom").val($.cookie("nom_to_backup"))
    $("#prenom").val($.cookie("prenom_to_backup"))
    $("#email").val($.cookie("email_to_backup"))
}
function param(){
data={}
     if(!$("#inter_id").val() ||!$("#stat_id").val() ){
        alert("veuillez remplir ce champs")
         return
    }
    data["inter_id"] = $('#inter_id').val()
    data["stat_id"] = $('#stat_id').val()
    $.ajax({
        type: 'POST',
        url: config_app,
        data:data,
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            alert("type d'intervention enregisté avec succèss")
            
        },
        error:function(response){ 
            console.log(response) 
        } 
    })
}
 $('#param_id').on('click',function(){
    param()
 })
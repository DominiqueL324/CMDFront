evt=[]
function configCal() {
    calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locales: 'fr',
    themeSystem: 'bootstrap',
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    selectable: true,
    nowIndicator: true,
    dayMaxEvents: true,
    headerToolbar: {
        left: 'prev,next',
        center: 'title',
    },
    datesSet: function(info){
        evt = getEvent(info.startStr.split('T')[0],info.endStr.split('T')[0])
    },
    eventMouseEnter: function (info) {
        tooltip = '<div class="tooltiptopicevent" style="opacity:1;width:auto;height:auto;background:#feb811;position:absolute;z-index:10001;padding:10px 10px 10px 10px ;  line-height: 200%;">' + 'RDV: ' + ': ' + info.event.title + '</br>' + 'Date: ' + ': ' + info.event.start + '</div>';

        $("body").append(tooltip);
        $(this).mouseover(function (e) {
            $(this).css('z-index', 1);
            $('.tooltiptopicevent').fadeIn('500');
            $('.tooltiptopicevent').fadeTo('10', 1.9);
        }).mousemove(function (e) {
            $('.tooltiptopicevent').css('top', e.pageY + 10);
            $('.tooltiptopicevent').css('left', e.pageX + 20);
        });
    },
    eventMouseLeave: function (data, event, view) {
        $(this).css('z-index', 8);
        $('.tooltiptopicevent').remove();
    },
    eventClick: function (arg) {
        $.cookie('rdv_to_edit',arg.event._def.publicId)
        window.location.replace("edit_rdv.html")
    },
    eventRender: function (info) {
        var tooltip = new Tooltip(info.el, {
            title: info.event.extendedProps.description,
            placement: 'top',
            trigger: 'hover',
            container: 'body'
        });
    },
        });
    console.log(evt)
    calendar.render();
}
function getEvent(debut,fin){
    calendar.removeAllEvents()
    $.ajax({
        type: 'GET',
        url: rdv_add,
        data: {"debut":debut,'fin':fin},
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            response["results"].forEach(elt =>{
                var nom_evt=""
                if(elt["agent"]!= null){
                    nom_evt= elt["agent"]['trigramme']
                }
                
                nom_evt = nom_evt+"/"+elt['intervention']['type'].slice(0, 3).toUpperCase();
                if(elt["audit_planneur"]!= null){
                    nom_evt = nom_evt+"/"+elt['audit_planneur']['trigramme']
                }
                nom_evt = nom_evt+"/"+elt['propriete']['type']
                nom_evt = nom_evt+"/"+elt['propriete']['ville']
                nom_evt = nom_evt+"/"+elt['propriete']['locataire']['nom']
                nom_evt = nom_evt+"/"+elt['client']['user']['nom']
                var couleur=""
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
               ev = {
                    id: elt["id"],
                    title: nom_evt,
                    start: elt['date'].split("T")[0],
                    backgroundColor: couleur,
                    borderColor: couleur,
                }
                calendar.addEvent(ev)
                evt.push(ev)
            })
        },
        error: function(response){
            alert("Echec de pRécupération des Rendez-vous")
        }
    })
    return evt
}
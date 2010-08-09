google.load("jquery", "1.4.2");
google.load("jqueryui", "1.8.3");
google.setOnLoadCallback(function() {
    jQueryExtensions();
    $(function() {
        
        $(window).resize(function() {            
            var w = $(".selectedVid").width();
            var h = Math.ceil((w*9.0)/16.0);
            $(".youtube-player").attr('height',h).attr('width',w);                                             
        }).resize();

        $(".selectFeed").buttonset()
        $(".selectFeed input").click(loadSelectedFeed);
        loadSelectedFeed();
        $("ul.vids").selectable({
            selected:function(event,ui) {
                var item = $("ul.vids li.ui-selected").data('item');
                $(".selectedVid .title").text(item.title);
                $(".selectedVid .description").text(item.description);
                $(".selectedVid .youtube-player").attr("src","http://www.youtube.com/embed/" + item.id + "?fmt=34");
            }
        });
    });
});

function loadSelectedFeed() {
    var user = $("input:checked", "form").val();
    $("ul.vids").html("<li>Loading...</li>");
    $.getJSON("http://gdata.youtube.com/feeds/api/users/" + user + "/uploads?v=2&alt=jsonc&max-results=25&start-index=1", displayFeed);
}

function showTitle(title) {
    title = title.replace(/Grind Time Now Presents:/ig,"").replace(/Grind Time Now/ig,"GTN");
    title = title.replace(/Got Beef\?/g,"");
    title = title.replace(/KOTD -?/g,"");
    title = title.replace(/DON'T FLOP -?/g,"");
    title = title.replace(/URL +PRESENTS/ig,"");
    title = title.replace(/No Coast Battles:/g,"");
    title = title.replace(/presents:/ig,"");
    title = title.replace(/^ * - */,"");
    title = title.replace(/^ *\/ */,"");
    title = title.replace(new RegExp("(" + mcs() + ")","ig"), "<span class='mc'>$1</span>");
    return title.trim();
}

function mcs() {
    return "Fresco|Nocando|Surgeon General|Soul Khan|Dirtbag Dan|Sprungy|Justice|Madness|Th[a|e] ?Saurus|Cadallack Ron|Rheteric|XQZ|Unortodox Phrases|deadBeat|T-Rex|Murda Mook|Math Hoffa|poRICH|Sweet Youth|Mantra|Real Deal|Knowledge Medina|Hindu ?Rock|Conceited|Calicoe";
}

function displayFeed(data,textStatus) {
    var total = data.data.totalItems;
    $("ul.vids").html("");
    $.each(data.data.items, function(i, item) {
        $("ul.vids").append("<li>" + displayDate(item.uploaded) + showTitle(item.title) + "</li>");
        $("ul.vids li:last").data('item', item);
    });
}

function displayDate(date) {
    var d = humane_date(date.replace(/\.\d+Z$/g,"Z"));
    var c = d.match(/Just Now|minute|hour/) ? " today" : "";
    return "<span class='date" + c + "'>" + d + "</span>";
}


function jQueryExtensions() {
    jQuery.fn.extend({
	    highlight: function(search, insensitive, klass){
		    var regex = new RegExp('(<[^>]*>)|(\\b'+ search.replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1") +')', insensitive ? 'ig' : 'g');
		    return this.html(this.html().replace(regex, function(a, b, c){
			    return (a.charAt(0) == '<') ? a : '<strong class="'+ klass +'">' + c + '</strong>'; 
		    }));
	    }        
    });
}
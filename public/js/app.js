google.load("jquery", "1.4.2");
google.load("jqueryui", "1.8.3");
google.setOnLoadCallback(function() {
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
                $(".selectedVid .youtube-player").attr("src","http://www.youtube.com/embed/" + item.id);
            }
        });
    });
});

function loadSelectedFeed() {
    var user = $("input:checked", "form").val();
    $("ul.vids").html("<li>Loading...</li>");
    $.getJSON("http://gdata.youtube.com/feeds/api/users/" + user + "/uploads?v=2&alt=jsonc&max-results=25&start-index=1", displayFeed);
}

function embeddedVideo(item) {
    return '<iframe class="youtube-player" type="text/html" width="400" src="http://www.youtube.com/embed/{{id}}" frameborder="0"></iframe>'.replace("{{id}}",item.id)
}

function shorten(title) {
    title = title.replace(/Grind Time Now .resents:/g,"").replace(/Grind Time Now/g,"GTN")
    title = title.replace(/Got Beef\? Presents:/g,"")
    title = title.replace(/KOTD -?/g,"")
    title = title.replace(/DON'T FLOP -?/g,"")
    title = title.replace(/URL PRESENTS/g,"").replace(/URL Presents/g,"")
    title = title.replace(/No Coast Battles:/g,"")
    title = title.replace(/[p|P]resents:/g,"")
    return title.trim();
}

function displayFeed(data,textStatus) {
    var total = data.data.totalItems;
    $("ul.vids").html("");
    $.each(data.data.items, function(i, item) {
        $("ul.vids").append("<li>" + displayDate(item.uploaded) + shorten(item.title) + "</li>");
        $("ul.vids li:last").data('item', item);
    });
}

function displayDate(date) {
    return "";
    // return "<span class='date'>" + prettyDate(date) + "</span>";
}
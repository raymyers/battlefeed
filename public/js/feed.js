google.setOnLoadCallback(function() {
    jQueryExtensions();
    $(function() {
        
        $(window).resize(function() {
            var w = $(".selectedVid").width();
            var h = Math.ceil((w*9.0)/16.0);
            $(".youtube-player").attr('height',h).attr('width',w);                                             
            $(".flyer").attr('width',w);                                             
        }).resize();

        $(".enlargeButton input").button().toggle(
          function() {
            $(".selectedVid").removeClass("grid_6").addClass("grid_9");
            $(".feedListing").removeClass("grid_6").addClass("grid_3");
            $(window).resize();},
          function() {
            $(".selectedVid").removeClass("grid_9").addClass("grid_6");
            $(".feedListing").removeClass("grid_3").addClass("grid_6");
            $(window).resize();}
        );
        $(".selectFeed .button").click(loadSelectedFeed);
        $(".selectFeed .button:first").click();
        
        $("ul.vids").selectable({
            selected: function(event,ui) {
                var item = $("ul.vids li.ui-selected").data('item');
                $("a.splash").remove();
                $(".hideDuringSplash").show();
                $(".selectedVid .title").text(item.title);
                $(".selectedVid .viewCount").text(addCommas(item.viewCount +" views"));
                $(".selectedVid .description").text(item.description == item.title ? "" : item.description);
                $(".selectedVid .youtube-player").attr("src","http://www.youtube.com/embed/" + item.id + "?fmt=34");
            }
        });
        $(".browserWarning").click(function() {$(this).fadeOut();});
        $(".hideDuringSplash").hide();
    });
});

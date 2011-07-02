google.load("jquery", "1.4.3");
google.load("jqueryui", "1.8.6");
google.setOnLoadCallback(function() {
    jQueryExtensions();
    $(function() {
        
        $(window).resize(function() {
            var w = $(".selectedVid").width();
            var h = Math.ceil((w*9.0)/16.0);
            $(".youtube-player").attr('height',h).attr('width',w);                                             
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
        $(".selectFeed").buttonset();
        $(".selectFeed input").click(loadSelectedFeed);
        loadSelectedFeed();
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

function loadSelectedFeed() {
    var feed = getSelectedFeed();
    $("ul.vids").html("<li>Loading...</li>");
    var cached = $("ul.vids").data(feed);
    if (cached) {
        displayFeed(cached,"Success");
    } else {
        $.getJSON("http://gdata.youtube.com/feeds/api/" + feed + "?v=2&alt=jsonc&max-results=25&start-index=1&callback=?", displayFeed);
    }
}

function getSelectedFeed() {
    return $("input:checked", "form").val();
}
// TODO, counteract all caps.
function showTitle(title) {
    // Normalize spacing.
    title = title.replace(/\s+/g," ");
    // We don't need to be reminded of the league name in every title.
    title = title.replace(/^.*presents?:/i,"");
    title = title.replace(/Grind Time Now Presents:/ig,"").replace(/Grind Time Now/ig,"GTN");
    title = title.replace(/Got Beef\?/g,"");
    title = title.replace(/KOTD -?/g,"");
    title = title.replace(/DON'T FLOP -?/g,"");
    title = title.replace(/^ ?THE JUNGLE ?/i,"");
    title = title.replace(/^Texas Battle League:? ?/i,"");
    title = title.replace(/URL +PRESENTS/ig,"");
    title = title.replace(/FlipTop ?- ?/ig,"");
    title = title.replace(/SMACK ?\/ */ig,"");
    title = title.replace(/No Coast Battles:/g,"");
    title = title.replace(/Body Bag Battles ?:?/ig,"");
    title = title.replace(/^ * - */,"");
    title = title.replace(/ ?-? ?FINAL ?$/,"");
    // We get it. It's a battle.
    title = title.replace(/\[ ?FULL ?BATTLE ?\]/ig,"");
    title = title.replace(/Rap Battle *-? */ig,"");
    // Watchlist of MCs. Congrats if you're in it.
    title = title.replace(new RegExp("(" + mcs() + ")","ig"), "<span class='mc'>$1</span>");
    return trimString(title);
}

function mcs() {
    return "Dizaster|Fresco|D-Lor|Nocando|Surgeon General|Passwurdz|" + 
"Soul Khan|Dirtbag Dan|Justice|360|Madness|Th[a|e] ?Saurus|" +
"Cadallack Ron|Rheteric|XQZ|Unorthodox Phrases|deadBeat|T-Rex|" + 
"Murda Mook|Math Hoffa|Mac Lethal|poRICH|Mantra|" + 
"Real Deal|Knowledge Medina|Conceited|" +
"Iron Solomon|Cortez|DNA|Hollohan|Charron|Oshea|QP|Eurgh|Illmaculate|Ness Lee|Sonny Bamboo|ATM|Organic|Organik|Biscuit|" +
"Bender|Mr.Biscuit|Okwerdz|Skils|Nils";
}

function displayFeed(data,textStatus) {
    data.data.items.sort(compareFeedItem);
    var total = data.data.totalItems;
    $("ul.vids").html("").data(getSelectedFeed(), data);    
    $.each(data.data.items, function(i, item) {
        // For Playlists
        if (item.video) {
            item = item.video;
        }
        $("ul.vids").append("<li>" + displayDate(item.uploaded) + showTitle(item.title) + "</li>");
        $("ul.vids li:last").data('item', item);
    });
    $("ul.vids li").each(function() {
        var date = $(this).find(".date");
        var dateWidth = date.outerWidth();
        $(this).css("text-indent",-dateWidth).css("padding-left", dateWidth);
    });
    hideSpinner();
}

function hideSpinner() {
    $("#splash .spinner").remove();
}

function compareFeedItem(a,b) {
    var cmp = function(x,y) {
        return x < y ? -1 : (y < x ? 1 : 0);  
    }

    a = a.video ? a.video : a;
    b = b.video ? b.video : b;
    aTitle = a.title.replace(/\s+/g, " ");
    bTitle = b.title.replace(/\s+/g, " ");
    
    // Youtube uses "2010-08-06T03:56:33.000Z"
    // What's the best datetime format to use?
    // Must work with Date.parse() on all browsers.
    aAge = parseDateAsAge(a.uploaded);
    bAge = parseDateAsAge(b.uploaded);
    // If posted within two days and similar titles, sort alphabetically by title.
    // For things like "Pt 1", "Parts 2 & 3", etc...
    if (areWithinDays(2, aAge, bAge) && areTitlesSimilar(aTitle, bTitle)) {
        return cmp(aTitle, bTitle);
    }
    return cmp(aAge, bAge);
}


function areWithinDays(window, a,b) {
    var oneDayInSeconds = 60*60*24;
    return Math.abs(a - b) < (window * oneDayInSeconds); 
}

// Good enough for:
//   CONCEITED vs GOODZ RD 1
//   CONCEITED vs GOODZ ROUNDS 2 & 3
// Still can't catch:
//   CALICOE vs RICH DOLARZ RD 1
//   RICH DOLARZ vs CALICOE RD 2
//   CALICOE vs RICH DOLARZ RD 3
// Seriously, URL, wtf?
function areTitlesSimilar(a, b) {
    var regex = /(rd|round|pt|part)s?\.? ?\d.*$/i;
    return trimString(a.replace(regex,"")) == trimString(b.replace(regex,""));
}

function displayDate(date) {
    var d = humane_date(date);
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

// IE doesn't define .trim()... I need some kind of IE compat library.
function trimString(s) {
    return s.replace(/^\s+|\s+$/g, ''); 
}

function addCommas(nStr) {
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}


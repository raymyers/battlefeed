var matching = 0;
var startIndex = 1;
var term;
google.setOnLoadCallback(function() {

  $(function() {
      term = $("#term").val();
      $("#watch").addClass('grid_6');
      $(window).resize(function() {
          var w = $("#watch").width();
          var h = Math.ceil((w*9.0)/16.0);
          $(".youtube-player").height(h).width(w);
       }).resize();
       $("input#term").val(term).keypress(function(e){
        if(e.which == 13){
          term = $(this).val();
          fetchFeed();
        }
      });
      fetchFeed();
      
      $("button#enlarge").button().text("Enlarge").click(function(){
        $("#watch").toggleClass('grid_6').toggleClass('grid_10');
        $(window).resize();
      }); 
  });

});
function clearRows() {
   $("#lore tr").remove();
}

var leagueUsers = ['jumpoff','amilonakis','drect','kingofthedot',"GroundZeroBattles",'westtexasrapbattles','dontflop','gotbeefbattles','jfox209sons','theurltv','nocoastraps','crtclrp','bodybagbattles','absyrd','texasbattleleague','fliptopbattles'];
var leagueMap = {
jumpoff:"Jump Off",
drect:"Grind Time",
kingofthedot:"KOTD",
dontflop:"Don't Flop",
gotbeefbattles:"Got Beef",
jfox209sons:"Jungle",
theurltv:"URL",
nocoastraps:"No Coast",
crtclrp:"Basementality",
bodybagbattles:"Bodybag",
mrcoloradorap:"Colorado Rap",
groundzerobattles:"Ground Zero",
absyrd:"A&B",
texasbattleleague:"Texas",
westtexasrapbattles:"West Texas",
amilonakis:"Grind Time",
fliptopbattles:"Flip Top"};
 
  function fetchFeed() {
   clearRows();
   callsRemaining = 0;
   var i;
   for (i=0;i<5;i++) {
     $.each(leagueUsers,
     function(ai, author) {
     fetchFeedStartIndex(author,i*50+1); 
     callsRemaining++;
    });
  }
}
function fetchFeedStartIndex(author,startIndex) {
  $.getJSON("https://gdata.youtube.com/feeds/api/videos?q=" + term + "&max-results=50&start-index=" + 
      startIndex + 
      "&orderby=published&v=2&author=" + author + "&alt=jsonc", 
      displayLoreFeed);
}

function isUsableTitle(title) {
title = title.toLowerCase();
return !(title.indexOf('cypher') > -1 || 
title.indexOf('freestyle') > -1 || 
title.indexOf('trailer') > -1 || 
title.indexOf('in sweden') > -1 || 
title.indexOf('strategy room') > -1 || 
title.indexOf('announcement') > -1 || 
title.indexOf('highlights') > -1 ||
title.indexOf('performing') > -1 ||
title.indexOf('performance') > -1 ||
title.indexOf('session') > -1 ||
title.indexOf('preview') > -1 ||
title.indexOf('music video') > -1 ||
title.indexOf('respon') > -1 ||
title.indexOf('calls out') > -1 ||
title.indexOf('coming soon') > -1 ||
title.indexOf('interview') > -1 ||
title.indexOf('spaz') > -1 ||
title.indexOf('speaks on') > -1 ||
title.indexOf('blog') > -1);
}

var callsRemaining = 0;
function displayLoreFeed(data,textStatus) {
    //data.data.items.sort(compareFeedItem);
    var total = data.data.totalItems;
    if (data.data.items) {
      $.each(data.data.items, function(i, item) {
        // For Playlists
        //if (item.video) {
        //    item = item.video;
        //}
        //alert($.inArray(item.uploader, ['drect','KingOfTheDot','DontFlop','gotbeefbattles','jfox209sons','theUrltv','NoCoastRaps','crtclrp','BodyBagBattles','Absyrd','TexasBattleLeage','fliptopbattles']));
        var title = showTitle(item.title);
        if(title.toLowerCase().indexOf(term.toLowerCase()) > -1 && isUsableTitle(title)) {
          matching++;
          var tableBody = $("table#lore tbody");
          tableBody.append(buildItemRowHtml(title, item));
          tableBody.find("tr:last").data('item', item);
	}
      });
    }
    /*if ((total > 50 + startIndex) && matching < 50) {
       fetchFeed();
       startIndex += 50;
    } else {
    }*/
    if (--callsRemaining < 1) {
      callsRemaining = 0;
      rowSelectionInit();
    }
  }
function buildItemRowHtml(title, item) {
  return "<tr>" + 
	  td(title) + 
	  td(item.uploaded.substring(0,10)) +
	  td(addCommas(item.viewCount)) +
	  td(leagueMap[item.uploader.toLowerCase()]) +
          "</tr>";
}

function td(content) {
  return "<td>" + content + "</td>";
}

function rowSelectionInit() {
    $("table#lore tbody").selectable({
      selected: function(event,ui) {
        var item = $("tr.ui-selected").data('item');
        $("#watch .youtube-player").attr("src","http://www.youtube.com/embed/" + item.id + "?fmt=34");
     }});
}



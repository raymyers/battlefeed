google.load("jquery", "1.6.2");

google.setOnLoadCallback(function() {
  $(function() {
    $("#battleContent").hide();
    $("#battleLink").click(function() {
      $(".content").hide();
      $("#battleContent").show();
    });
    $("#homeLink").click(function() {
      $(".content").hide();
      $("#homeContent").show();
    });
  });
});



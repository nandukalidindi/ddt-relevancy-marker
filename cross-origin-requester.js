chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if (request.action == "xhttp") {
    $.ajax({
      url: request.url,
      method: request.method,
      data: request.data,
      success: function(response) {
        callback(JSON.stringify(response));
      },
      error: function(err) {
        console.log(err);
        callback(null);
      }
    })
    return true;
  }
});

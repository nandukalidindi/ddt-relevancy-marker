document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get('ddt', function(response) {
    var ddtInputElement = document.getElementById('ddt-server');
    if(ddtInputElement) {
      acheInputElement.value = response.ddt;
    }
  })

  document.getElementById("submit").addEventListener('click', function(event) {
    var ddtInputElement = document.getElementById('ddt-server');
    if(ddtInputElement.value !== "") {
      chrome.storage.sync.set({'ddt': ddtInputElement.value}, function() {

      });
    }
  });
});

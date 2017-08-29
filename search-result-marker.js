$(document).ready(function() {
  chrome.storage.sync.get('ddt', function(response) {
    if(response.ddt) {
      chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: response.ddt + "/getAvailableDomains",
        data: {type: 'init'}
      }, function(responseText) {
        var selectedDomainId = null;
        var selectedURL = null;
        var domainIdNameMap = [{name: 'None', id: 'none'}];
        var domainMap = (JSON.parse(responseText || "{}").crawlers || []).map(domain => { return { name: domain.name, id: domain.id }});
        domainIdNameMap.push(...domainMap);
        var searchResults = document.getElementsByClassName("rc");

        for(var i=0; i<searchResults.length; i++) {
          var result = searchResults[i];

          var parentDiv = document.createElement('div');

          parentDiv.style.position = 'absolute';
          parentDiv.style.top = '0px';
          parentDiv.style.right = '-75px';
          parentDiv.style['z-index'] = 9999;
          parentDiv.style.cursor = 'pointer';

          var id = result.children[0].getElementsByTagName('a')[0].href

          parentDiv.appendChild(createSelectList(domainIdNameMap, {}, id));

          var buttonDiv = document.createElement('div');

          buttonDiv.style['pointer-events'] = 'none';
          buttonDiv.style.opacity = 0.5;

          buttonDiv.appendChild(createButtonElement('RELEVANT', {right: '-75px'}, relevantClick));
          buttonDiv.appendChild(createButtonElement('IRRELEVANT', {right: '-150px'}, irrelevantClick));
          parentDiv.appendChild(buttonDiv);

          result.appendChild(parentDiv);
        }

        function createSelectList(options, style, id) {
          var selectList = document.createElement("select");
          selectList.id = id;

          options.forEach(nameId => {
            var option = document.createElement("option");
            option.value = nameId.id;
            option.text = nameId.name;
            selectList.appendChild(option);
          });

          selectList.addEventListener("change", onDomainSelectionChange)

          return selectList;
        }

        function onDomainSelectionChange(event) {
          if(event.target.value !== 'none') {
            event.target.parentElement.children[1].style['pointer-events'] = 'auto';
            event.target.parentElement.children[1].style.cursor = 'pointer';
            event.target.parentElement.children[1].style.opacity = 1.0;

            selectedDomainId = event.target.value;
            selectedURL = event.target.parentElement.parentElement.children[0].getElementsByTagName('a')[0].href;
          } else {
            event.target.parentElement.children[1].style['pointer-events'] = 'none';
            event.target.parentElement.children[1].style.opacity = 0.5;
          }
        }

        function createButtonElement(value, style, onClickCallback) {
          var element = document.createElement('input');
          element.setAttribute('type', 'button');
          element.setAttribute('value', value);
          element.addEventListener('click', onClickCallback);
          return element;
        }

        function relevantClick(event) {
          if(selectedDomainId) {
            chrome.runtime.sendMessage({
              method: 'POST',
              action: 'xhttp',
              url: response.ddt + "/uploadUrls",
              data: {urls: selectedURL, tag: 'Relevant', session: JSON.stringify({domainId: selectedDomainId})}
            }, function(responseText) {
              var selectListElement = document.getElementById(selectedURL);
              if(selectListElement) {
                selectListElement.value = 'none';
                onDomainSelectionChange({target: selectListElement});
              }
              selectedDomainId = null;
              selectedURL = null;
            });
          }
        }

        function irrelevantClick(event) {
          if(selectedDomainId) {
            chrome.runtime.sendMessage({
              method: 'POST',
              action: 'xhttp',
              url: response.ddt + "/uploadUrls",
              data: {urls: selectedURL, tag: 'Relevant', session: JSON.stringify({domainId: selectedDomainId})}
            }, function(responseText) {
              var selectListElement = document.getElementById(selectedURL);
              if(selectListElement) {
                selectListElement.value = 'none';
                onDomainSelectionChange({target: selectListElement});
              }
              selectedDomainId = null;
              selectedURL = null;
            });
          }
        }
      });
    }
  })
})

// var url = window.location.href;
//
// setInterval(function() {
//   if(window.location.href !== url) {
//      url = window.location.href;
//      debugger;
//   }
// }, 4000);

// (function(){
//     var lastHash = location.hash;
//     $(window).bind('hashchange', function() {
//         var newHash = location.hash;
//         // Do something
//         var diff = compareHash(newHash, lastHash);
//         alert("Difference between old and new hash:\n"+diff[0]+"\n\n"+dif[1]);
//
//         //At the end of the func:
//         lastHash = newHash;
//     });
//
//     function compareHash(current, previous){
//         for(var i=0, len=Math.min(current.length, previous.length); i<len; i++){
//             if(current.charAt(0) != previous.charAt(0)) break;
//         }
//         current = current.substr(i);
//         previous = previous.substr(i);
//         for(var i=0, len=Math.min(current.length, previous.length); i<len; i++){
//             if(current.substr(-1) != previous.substr(-1)) break;
//         }
//
//         //Array: Current = New hash, previous = old hash
//         return [current, previous];
//     }
// })()

// if ("onhashchange" in window) {
//     alert("The browser supports the hashchange event!");
// }
//
// function locationHashChanged() {
//     if (location.hash === "#somecoolfeature") {
//         somecoolfeature();
//     }
// }
//
// window.onhashchange = locationHashChanged;


// var target = document.getElementById('resultStats');
//
// var observer = new MutationObserver(function(mutations) {
//   mutations.forEach(function(mutation) {
//     console.log(mutation.type);
//   });
// });
//
// var config = { attributes: true, childList: true, characterData: true };
// debugger;
// observer.observe(target, config);

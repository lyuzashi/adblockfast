/*
  Copyright 2015 Rocketship <http://rocketshipapps.com/>

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Brian Kennish <brian@rocketshipapps.com>
    Kevin Brown <kevin.brown@make.com.au>
*/
function onReady(callback) {
  if (document.readyState == 'complete') callback();
  else addEventListener('load', callback);

  var iframe = document.getElementsByTagName('iframe');
  var observer = new MutationObserver(function(mutations) {
   mutations.forEach(function(mutation) {
     for (var i = 0; i < mutation.addedNodes.length; i++)
       iframe.push(mutation.addedNodes[i]);
       if (node.tagName == 'IFRAME') {
         node.style.display = 'none';
       }
   })
  });
  observer.observe(document, { childList: true });
  console.log(iframe, "hello");
}

function populate(style, selector) {
  // const SHEET = style.sheet;
  // if (SHEET) SHEET.insertRule(selector + ' { display: none !important }', 0);
  // else setTimeout(function() { populate(style, selector); }, 0);
}

var supportedSwapSizes = [
  '300x250',
  '728x90',
  '300x600'
];




function shouldSwapAd(element) {

  // var now = new Date();
  //
  // // Make sure it's the right time
  // if (now.getDay() == 5 && // Friday
  //     now.getHours() >= 17 && // 5PM
  //     now.getHours() <= 23)   // Up to 11:59PM (Could be removed, leaving for possiiblity of decrease in range)
  // {
    if (typeof(element) === 'undefined') {
      return true;
    }

    // Make sure we can handle the swap
    if (element.tagName == 'IFRAME' ||
        element.tagName == 'IMG') {

      var size = element.clientWidth + 'x' + element.clientHeight + 'x';

      if (supportedSwapSizes.indexOf(size) >= 0) {
        return true;
      }
    }
  // }

  return false;
}

function swapAd(element) {
  // select the target node

  // var size = element.clientWidth + 'x' + element.clientHeight;
  // var size = element.clientWidth + 'x' + element.clientHeight;
  // var myid = chrome.runtime.id;

  // if (element.tagName == 'IFRAME' && element.width == '300' && element.height == '250') {
  //     element.src = chrome.extension.getURL('/assets/' + '/300x250/' + '/index.html');
  // } else if (element.tagName == 'IFRAME' && element.width == '300' && element.height == '600') {
  //   element.src = chrome.extension.getURL('/assets/' + '/300x600/' + '/index.html');
  // } else if (element.tagName == 'IFRAME' && element.width == '728' && element.height == '90') {
  //   element.src = chrome.extension.getURL('/assets/' + '/728x90/' + '/index.html');
  // } else if (element.tagName == 'IFRAME' && element.width != '300' && element.width != '728') {
  //   element.src = chrome.extension.getURL('/assets/' + '/none.html');
  // } else if (element.tagName == 'IMG') {
  //   element.src = chrome.extension.getURL('/assets/' + '/none.html');
  // }
  if (element.tagName == 'IFRAME') {
    element.src = chrome.extension.getURL('/assets/' + '/none.html');
  } else if (element.tagName == 'IMG') {
    element.src = chrome.extension.getURL('/assets/' + '/none.html');
  }

}

const EXTENSION = chrome.extension;

EXTENSION.sendRequest({initialized: true}, function(response) {
  const PARENT_HOST = response.parentHost;
  const WHITELISTED = response.whitelisted;
  var ads;

  if (PARENT_HOST) {
    const SELECTOR = SELECTORS[PARENT_HOST];

    if (SELECTOR) {
      if (!WHITELISTED) {
        if (shouldSwapAd()) {
          // Swap content to our own ad
          // debugger;

        } else {
          const STYLE = document.createElement('style');
          (document.head || document.documentElement).insertBefore(STYLE, null);
          populate(STYLE, SELECTOR);
        }
      }

      onReady(function() {
        if (document.querySelectorAll(SELECTOR).length) ads = true;
      });
    }

    onReady(function() {
      const IFRAMES = document.getElementsByTagName('iframe');
      const IFRAME_COUNT = IFRAMES.length;

      for (var i = 0; i < IFRAME_COUNT; i++) {
        var iframe = IFRAMES[i];
        var childHost = getHost(iframe.src);
        console.log("we're gonna swap the ad");
        swapAd(iframe);
        if (childHost != PARENT_HOST)
            for (var j = DOMAINS_LENGTH - 1; j + 1; j--)
                if (DOMAINS[j].test(childHost)) {
                  if (!WHITELISTED) {
                    if (shouldSwapAd(iframe)) {
                      swapAd(iframe);
                    }
                    else {
                      var className = iframe.className;
                      iframe.className = (className ? className + ' ' : '') + 'chrome.extension-collapsed';
                    }
                  }

                  break;
                }
      }

      const IMAGES = document.getElementsByTagName('img');
      const IMAGE_COUNT = IMAGES.length;

      for (i = 0; i < IMAGE_COUNT; i++) {
        var image = IMAGES[i];
        var childHost = getHost(image.src);
        console.log("show me something please");

        if (childHost != PARENT_HOST)
            for (var j = DOMAINS_LENGTH - 1; j + 1; j--)
                if (DOMAINS[j].test(childHost)) {
                  if (!WHITELISTED) {
                    if (shouldSwapAd(image)) {
                      swapAd(image);
                    }
                    else {
                      var className = image.className;
                      image.className = (className ? className + ' ' : '') + 'chrome.extension-collapsed';
                    }
                  }

                  break;
                }
      }
    });
  }

  onReady(function() { EXTENSION.sendRequest({ads: ads}); });
});

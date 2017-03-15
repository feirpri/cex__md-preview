function getUrlContent(url) {
    return new Promise((resolve) => {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', resolve);
        xhr.open('GET', url);
        xhr.send();
    });
}
function toggleState(state = 'off') {
    let status = state === 'on' ? 'off' : 'on';
    setStatus(status);
    return status;
}
function getTabInfo() {
    return new Promise((resolve) => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            resolve(tabs[0]);
        });
    });
}

function sendMessage(data, callback) {
    return getTabInfo().then((tab) => {
        return new Promise((resolve) => {
            chrome.tabs.sendMessage(tab.id, data, resolve);
        });
    });
}
function renderContent(content) {
    return md.setContent(content).getInfo();
}
function renderFromUrl(url) {
    return getUrlContent(url).then((response) => {
        return renderContent(response.currentTarget.responseText);
    });
}
function setStatus(status = 'on') {
    if (status === 'on') {
        chrome.browserAction.setIcon({path: "images/icon48.png"});
        chrome.browserAction.setTitle({title: "Status: ON"});
    } else {
        chrome.browserAction.setIcon({path: "images/icon-off.png"});
        chrome.browserAction.setTitle({title: "Status: OFF"});
    }
}

chrome.browserAction.onClicked.addListener(function(tab) {
    var currentState = toggleState(localStorage.currentState);
    localStorage.currentState = currentState;
    sendMessage({
        cmd: currentState === 'on' ? 'enabled' : 'disabled'
    });
});

chrome.runtime.onMessage.addListener((msg, source, send) => {
    switch(msg.cmd) {
        case 'requestRender':
            renderFromUrl(msg.url).then((data) => {
                sendMessage({
                    cmd: 'render',
                    data: data
                });
            });
            break;
        default:
            break;
    }
});

localStorage.currentState = 'on';
setStatus('on');

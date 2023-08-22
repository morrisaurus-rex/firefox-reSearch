const bar = document.querySelector("#search-bar");
const button = document.querySelector("#search-button");

function ErrorReport(error) {
    console.log(`Error encountered when querying tabs: ${error}`);
}

function SendSearchString(seString, tabList) {
    let msgObj = {
        command: "exec_search",
        searchString: seString
    };

    browser.tabs.sendMessage(tabList[0].id, msgObj).catch(ErrorReport);
}

function SearchClickHandler(event) {
    browser.tabs.query({active: true, currentWindow: true})
    .then(SendSearchString.bind(null, bar.value))
    .catch(ErrorReport);
}

button.addEventListener('click', SearchClickHandler);
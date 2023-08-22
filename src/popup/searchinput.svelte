<script>
    import { MessageType, Message } from '../message_protocol.js'

    export let searchstring = "";

    function ErrorReport(error) {
        console.log(`Error encountered when querying tabs: ${error}`);
    }

    function SendSearchString(seString, tabList) {
        let msgObj = new Message(MessageType.SEARCH, [seString]);

        browser.tabs.sendMessage(tabList[0].id, msgObj).catch(ErrorReport);
    }

    function SearchClickHandler(event) {
        browser.tabs.query({active: true, currentWindow: true})
        .then(SendSearchString.bind(null, searchstring))
        .catch(ErrorReport);
    }

    function EnterListener(event) {
        if (event.key == "Enter") SearchClickHandler(event);
        else return;
    }

</script>

<style>
    div {
        display: flex;
        flex-direction: row;
    }
</style>

<svelte:options customElement="search-input"></svelte:options>

<div>
    <input bind:value={searchstring} on:keydown={EnterListener} type="text">
    <button on:click={SearchClickHandler} > "click" </button>
</div>
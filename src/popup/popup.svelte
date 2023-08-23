<script>
    import SearchInput from './searchinput.svelte'
    import Pager from './pager.svelte'
    import {Message, MessageType} from '../message_protocol.js'
    // Import for Intellisense purposes
    import { HighlightReplacement } from '../highlight_replacement.js';

    let maxMatches = -1;
    let currentMatch = -1
    /**@type HighlightReplacement */
    let matchInfo = null;

    function ClearState() {
        maxMatches = -1;
        currentMathc = -1;
        matchInfo = null;
    }

    /**
     * Listen for messages sent from browser.runtime.
     * @param message { Message } Object sent by the content script.
     */
    function MessageListener(message) {
        debugger;
        switch(message.command) {
            case MessageType.SENT_NUM:
                currentMatch = (message.params[0]) ? message.params: -1;
                matchInfo = message.params[1];
                break;
            case MessageType.SENT_MAX:
                maxMatches = message.params[0];
                break;
            default:
                break;

        }
    }


    /**
     * Consume dispatched messages sent from nested components.
     * @param event
     */
    function BubbleHandler(event) {
        let msgObj = event.detail;

        // keep switch, may have more commands to add
        switch(msgObj.command) {
            case MessageType.CLEAR:
                ClearState();
                break;
            default:
                break;
        }

        debugger;
        browser.tabs.query({active: true, currentWindow: true})
        .then(tabs => {browser.tabs.sendMessage(tabs[0].id, msgObj);})
        .catch(ErrorReport);
    }

    // Prevent an error when viewing through preview server
    try {
        browser.runtime.onMessage.addListener(MessageListener);
    } catch (e) {}

</script>

<svelte:options customElement="extension-popup"></svelte:options>

<style>
    body {
        display: flex;
        flex-direction: column;
        max-width: 20em;
    }
</style>

<body>
    <SearchInput on:message={BubbleHandler}>
    </SearchInput>
    <Pager bind:maxMatches bind:currentMatch bind:matchInfo on:message={BubbleHandler}>
    </Pager>
</body>
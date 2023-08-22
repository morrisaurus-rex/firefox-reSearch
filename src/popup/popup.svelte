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

    function MessageListener(message) {
        switch(message.command) {
            case MessageType.SENT_NUM:
                currentMatch = (message.params[0]) ? message.params: -1;
                matchInfo = message.params[1];
                break;
            case MessageType.SENT_MAX:
                maxMatches = message.params[0];
                break;

        }
    }

</script>

<svelte:options customElement="Extension-Popup"></svelte:options>

<style>
    body {
        display: flex;
        flex-direction: column;
    }
</style>

<h4>Search</h4>
<body>
    <SearchInput>
    </SearchInput>
    <Pager bind:maxMatches bind:currentMatch bind:matchInfo>
    </Pager>
</body>
<!-- svelte-ignore a11y-click-events-have-key-events -->

<script>
    import { createEventDispatcher } from "svelte";
    import { Message, MessageType } from "../message_protocol.js";
    // Import for Intellisense purposes
    import { HighlightReplacement } from "../highlight_replacement.js"

    const dispatch = createEventDispatcher();

    export let currentMatch = -1;
    export let maxMatches = -1;
    /**
     * @type HighlightReplacement
     */
    export let matchInfo = null;

    function IncrementFocus() {
        if (currentMatch < maxMatches) {
            // Just create the object for the popup component to pass along
            let command = new Message(MessageType.JUMP_TO, [currentMatch + 1]);
            dispatch("message", command);
        }
    }

    function DecrementFocus() {
        if (currentMatch > 0) {
            let command = new Message(MessageType.JUMP_TO, [currentMatch - 1]);
            dispatch("message", command);
        }
    }

    
</script>

<style>
    .component-outer-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 5px;
    }
    #match-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    #match-display {
        justify-content: center;
    }

    #match-display span {
        width: 100%;
        color: rgb(190, 190, 190);
    }
    
    #arrows-container {
        flex-grow: 0;
        flex-direction: column;
        row-gap: 5px;
        align-self: self-start;
    }

    .arrow {
        border-style: solid;
        width: 0em;
        margin: 2px;
    }

    .arrow-up {
        border-color: transparent transparent rgb(190, 190, 190) transparent;
        border-width: 0em 0.7em 0.8em 0.7em;
    }

    .arrow-down {
        border-color: rgb(190, 190, 190) transparent transparent transparent;
        border-width: 0.8em 0.7em 0em 0.7em;
    }

    .arrow-up:hover {
        border-bottom-color: rgb(235, 182, 9);
    }

    .arrow-down:hover {
        border-top-color: rgb(235, 182, 9);
    }


</style>

<div class="component-outer-container">
    <div id="match-container">
        <!-- Shows the current focused match text -->
        <div id="match-display">
            {#if (matchInfo)}
                {matchInfo.textContent}
            {:else}
                <span>No matches</span>
            {/if}
        </div>
        <!-- Shows the number of matches and the index of the current match. -->
        <div id="match-counter">  
        {#if maxMatches == 1}
            Showing {currentMatch + 1} of 1 match.
        {:else if maxMatches > 1}
            Showing {currentMatch + 1} of {maxMatches} matches.
        {/if}
        </div>
    </div>
    <!-- Match increment/decrement buttons -->
    <div id="arrows-container">
        <div class="arrow-up arrow" on:click={IncrementFocus}></div>
        <div class="arrow-down arrow" on:click={DecrementFocus}></div>
    </div>
</div>
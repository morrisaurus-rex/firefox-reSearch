<script>
    // Import for Intellisense purposes
    import { HighlightReplacement } from "../highlight_replacement.js"

    export let currentMatch = -1;
    export let maxMatches = -1;
    /**
     * @type HighlightReplacement
     */
    export let matchInfo = null;

    function GetAggregatedText() {
        if (matchInfo) {
            let intermediate = ""
            for (let child of matchInfo.wrapper.children) {
                intermediate += child.textContent;
            }
            return intermediate;
        }
        else return;
    }
    
</script>

<style>
    body {
        display: flex;
        flex-direction: column;
    }
</style>

<body>
    <div id="match-display">
        {#if (matchInfo)}

        {:else}
        {/if}
    </div>
    <div id="match-counter">
    {#if maxMatches < 0}
        <br>
    {:else if maxMatches == 1}
        Showing {currentMatch} of 1 match.
    {:else}
        Showing {currentMatch} of {maxMatches} matches.
    {/if}
    </div>
</body>
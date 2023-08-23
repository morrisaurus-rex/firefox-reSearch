<script>
    import { MessageType, Message } from '../message_protocol.js'
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    export let searchstring = "";

    function ErrorReport(error) {
        console.log(`Error encountered when querying tabs: ${error}`);
    }


    function SearchClickHandler(event) {
        let msgObj = new Message(MessageType.SEARCH, [searchstring]);
        dispatch("message", msgObj);
    }

    function EnterListener(event) {
        if (event.key == "Enter") {
            if (searchstring.length == 0)
                ClearClickHandler(event);
            else
                SearchClickHandler(event);
        }
        else return;
    }

    function ClearClickHandler(event) {
        let msgObj = new Message(MessageType.CLEAR, []);
        dispatch("message", msgObj);
        searchstring = "";
    }

    function CaseToggle(mevent) {
        let id = mevent.target.id;
        if (id == "false") {
            mevent.target.setAttribute("id", "true");
        } else {
            mevent.target.setAttribute("id", "false");
        }
    }

</script>

<style>
    div {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    input {
        border-color: transparent;
        flex-grow: 1;
    }

    .inset-button {
        margin: 1px;
        padding: 2px;
        border-radius: 2px;
        flex-grow: 0;
        background-color: transparent;
        border-color: transparent;
    }

    #false {
        color: rgba(0, 0, 0, 0.3);
    }
    #false:hover {
        color: rgb(255, 255, 255);
        background-color: rgba(0, 0, 0, 0.3)
    }

    #true {
        color: rgb(255, 255, 255);
        background-color: rgba(0, 0, 0, 0.3)

    }

    #true:hover {
        background-color: rgba(0, 0, 0, 0.5)
    }

    #input-field {
        flex-grow: 1;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.3);
        padding: 1px;
        border-width: 1px;
    }
    button {
        flex-grow: 0;
    }

</style>

<div>
    <div id="input-field">
        <input bind:value={searchstring} on:keydown={EnterListener} type="text">
        <button class="inset-button" id="false" title="Toggle case sensitivity" on:click={CaseToggle}>
            Aa
        </button>
    </div>
    <button on:click={SearchClickHandler}> Go </button>
    <button on:click={ClearClickHandler}>Clear</button>
</div>
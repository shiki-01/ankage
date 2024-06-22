<script lang="ts">
    export let words: any[] = [];
</script>

<main>
    <h1>Words</h1>
    <ul>
        {#each words as word}
            <li>{word}</li>
        {/each}
    </ul>
</main>
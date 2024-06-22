<script lang="ts">
    import { items } from "$lib/store";
</script>

<main>
    {#if $items}
        <ul>
            {#each $items as item}
                <li>{item}</li>
            {/each}
        </ul>
    {:else}
        <p>データがありません</p>
    {/if}
</main>
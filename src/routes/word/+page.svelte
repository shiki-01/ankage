<script lang="ts">
    import { items } from "$lib/store";
	import { orderBy } from "firebase/firestore";
</script>

<main>
    {#if $items}
        <ul>
            {#each $items as item}
                {#each Object.keys(item) as key}
                    <li>{key}: {item[key].name}</li>
                {/each}
            {/each}
        </ul>
    {:else}
        <p>データがありません</p>
    {/if}
</main>
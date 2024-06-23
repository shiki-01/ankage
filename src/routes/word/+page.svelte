<script lang="ts">
    import { fade, fly } from 'svelte/transition';
	import { items, type StorageItem } from '$lib/store';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch, Icon } from 'svelte-ux';
	import { mdiCheck } from '@mdi/js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { authStore } from '$lib/store';

	$: word = $items
		.filter((item) => Array.isArray(item.word))
		.flatMap((item) => item.word) as unknown as StorageItem[];

	let editName: string;
	let editDesc: string;
	let userId: string | null;
	let editable: boolean = false;

	function edit(id: string) {
		if (!id || !word) {
			return;
		}
		const item = word.find((item) => item.id === id);
		if (item) {
			editName = item.name;
			editDesc = item.desc;
		} else {
			console.error('Item not found');
		}
	}

	function update(id: string) {
		if (editName && editDesc) {
			authStore.subscribe(async (value) => {
				userId = value.user ? value.user.uid : null;
				if (userId) {
					const storageRef = doc(db, 'users', userId, 'storage', id);
					await updateDoc(storageRef, {
						name: editName,
						desc: editDesc
					});
				}
			});

			editName = '';
			editDesc = '';
		}
	}

	function destroy(id: string) {
		if (!id) {
			return;
		}
		authStore.subscribe(async (value) => {
			userId = value.user ? value.user.uid : null;
			if (userId) {
				const storageRef = doc(db, 'users', userId, 'storage', id);
				await deleteDoc(storageRef);
			}
		});
	}

	function addItem() {
		if (!editName && !editDesc) {
			return;
		}
		authStore.subscribe(async (value) => {
			userId = value.user ? value.user.uid : null;
			if (userId) {
				const storageRef = collection(db, 'users', userId, 'storage');
				await addDoc(storageRef, {
					name: editName,
					desc: editDesc,
					type: 'word'
				});
			}
		});
	}
</script>

<main class="mx-auto flex flex-col gap-5 px-4">
	<div class="flex justify-end gap-4 items-center">
		<div class="flex items-center gap-2">
            <Label for="editable">Edit mode</Label>
            <Switch bind:checked={editable} id="editable">
                {#if editable}
                    <Icon data={mdiCheck} class="text-primary" size=".8em" />
                {/if}
            </Switch>
        </div>
		<Dialog.Root>
			<Dialog.Trigger>
				<Button color="primary" class="btn btn-primary">Add new item</Button>
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Add new item</Dialog.Title>
					<Dialog.Description>Add a new item here. Click save when you're done.</Dialog.Description>
				</Dialog.Header>
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name">Name</Label>
						<Input
							bind:value={editName}
							id="name"
							name="name"
							type="text"
							placeholder="Enter name"
							class="col-span-3"
						/>
					</div>
					<div class="grid grid-rows-4 items-center gap-4">
						<Label for="desc">Description</Label>
						<Textarea
							bind:value={editDesc}
							id="desc"
							name="desc"
							placeholder="Enter description"
							class="row-span-3 resize-none"
						/>
					</div>
				</div>
				<Dialog.Footer>
					<Button color="primary" type="submit" on:click={() => addItem()}>Save changes</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
	{#if $items}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each word as item}
				<div transition:fly={{ y: 50, duration: 300 }}>
                    <Card.Root class="mb-4">
                        <Card.Header>
                            <Card.Title>{item.name}</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <p>{item.desc}</p>
                        </Card.Content>
                        <Card.Footer>
                            <Dialog.Root>
                                <Dialog.Trigger>
                                    {#if editable}
                                        <div transition:fade>
                                                            <Button color="primary" class="btn btn-primary" on:click={() => edit(item.id)}>
                                                                edit</Button
                                                            >
                                                        </div>
                                    {/if}
                                </Dialog.Trigger>
                                <Dialog.Content class="sm:max-w-[425px]">
                                    <Dialog.Header>
                                        <Dialog.Title>Edit item</Dialog.Title>
                                        <Dialog.Description>
                                            Make changes to this item here. Click save when you're done.
                                        </Dialog.Description>
                                    </Dialog.Header>
                                    <div class="grid gap-4 py-4">
                                        <div class="grid grid-cols-4 items-center gap-4">
                                            <Label for="name">Name</Label>
                                            <Input
                                                bind:value={editName}
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Enter name"
                                                class="col-span-3"
                                            />
                                        </div>
                                        <div class="grid grid-rows-4 items-center gap-4">
                                            <Label for="desc">Description</Label>
                                            <Textarea
                                                bind:value={editDesc}
                                                id="desc"
                                                name="desc"
                                                placeholder="Enter description"
                                                class="row-span-3 resize-none"
                                            />
                                        </div>
                                    </div>
                                    <Dialog.Footer>
                                        <Button color="primary" on:click={() => update(item.id)}>Save changes</Button>
                                    </Dialog.Footer>
                                </Dialog.Content>
                            </Dialog.Root>
                        </Card.Footer>
                    </Card.Root>
                </div>
			{/each}
		</div>
	{:else}
		<p>データがありません</p>
	{/if}
</main>

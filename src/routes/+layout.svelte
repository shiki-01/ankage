<script lang="ts">
	import '../app.css';
	import { ThemeSelect, Button } from 'svelte-ux';
	import { faUser } from '@fortawesome/free-solid-svg-icons';
	import src from '$lib/img/ankage.svg';
	import { auth } from '$lib/firebase';
	import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
	import { authStore, items, type Items } from '$lib/store';

	let userIcon: string | null = null;
	let userId: string | null = null;

	onAuthStateChanged(auth, (user) => {
		authStore.set({ loggedIn: !!user, user: user, userId: user ? user.uid : null });
		authStore.subscribe((value) => {
			userId = value.userId;
		});
		userIcon = user ? user.photoURL : null;
	});

	function login() {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				if (result.user && result.user.email) {
					console.log('ログイン成功');
				}
			})
			.catch((error) => {
				console.log('ログイン失敗', error);
			});
	}

	function logout() {
		auth.signOut();
	}

	import { db } from '$lib/firebase';
	import {
		addDoc,
		collection,
		doc,
		getDoc,
		onSnapshot,
		orderBy,
		query,
		setDoc
	} from 'firebase/firestore';

	let userName: string | null;

	let unsubscribeAuth: () => void;
	let unsubscribeSnapshot: () => void;

	unsubscribeAuth = authStore.subscribe(async (value) => {
		userName = value.user ? value.user.displayName : null;
		userId = value.user ? value.user.uid : null;
		if (userId) {
			const userDocRef = doc(db, 'users', userId);
			const userDoc = await getDoc(userDocRef);
			if (!userDoc.exists()) {
				await setDoc(userDocRef, {
					uid: userId,
					name: userName
				});
				const storageRef = collection(db, 'users', userId, 'storage');
				await addDoc(storageRef, {
					name: 'First storage',
					desc: 'This is your first storage',
					type: 'word'
				});
			}
			const q = query(collection(db, 'users', userId, 'storage'), orderBy('name'));
			unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
				items.set([]);
				const newItems: Items = { word: [], sentence: [] };
				snapshot.forEach((doc) => {
					const data = doc.data();
					if (data.type === 'word' || data.type === 'sentence') {
						newItems[data.type as keyof Items].push({ id: doc.id, name: data.name, desc: data.desc});
					}
				});
				items.update((currentItems) => [...currentItems, newItems]);
			});
		}
	});

	import { onDestroy } from 'svelte';
	onDestroy(() => {
		unsubscribeAuth();
		if (unsubscribeSnapshot) {
			unsubscribeSnapshot();
		}
	});
</script>

<header class="flex items-center justify-between p-4">
	<a href="/">
		<img {src} alt="logo" class="h-12" />
	</a>
	<div class="flex items-center">
		<ThemeSelect lightThemes={['light']} darkThemes={['dark']} />
		{#if userId}
			<Button on:click={() => logout()} class="h-12">
				<img src={userIcon} alt="user icon" class="h-8 w-8 rounded-full" />
				Account
			</Button>
		{:else}
			<Button icon={faUser} on:click={() => login()} class="h-12">Sign in</Button>
		{/if}
	</div>
</header>
<div class="p-5 w-full h-full">
	{#if userId}
		<slot />
	{:else}
		<div class="w-full h-full flex flex-col gap-5 text-center align-middle">
			<p>Sign in to continue to the app</p>
			<div>
				<Button
					variant="fill-outline"
					color="primary"
					rounded
					class="btn btn-primary"
					on:click={() => login()}>Sign in</Button
				>
			</div>
		</div>
	{/if}
</div>

<style></style>

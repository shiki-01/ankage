<script lang="ts">
	import '../app.css';
	import { ThemeSelect } from 'svelte-ux';
	import { auth } from '$lib/firebase';
	import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
	import { authStore, items, type Items } from '$lib/store';

	let userId: string | null;

	onAuthStateChanged(auth, (user) => {
		authStore.set({ loggedIn: !!user, user: user });
		userId = user ? user.uid : null;
	});

	function login() {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				if (result.user && result.user.email) {
					console.log('ログイン成功');
				} else {
					console.log('このユーザーは承認されていません');
					auth.signOut();
				}
			})
			.catch((error) => {
				console.log('ログイン失敗', error);
			});
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
		userId = value.user ? value.user.uid : null;
		userName = value.user ? value.user.displayName : null;
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
					type: 'word'
				});
			}
			const q = query(collection(db, 'users', userId, 'storage'), orderBy('name'));
			unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
				const newItems: Items = { word: [], sentence: [] };
				snapshot.forEach((doc) => {
					const data = doc.data();
					if (data.type === 'word' || data.type === 'sentence') {
						newItems[data.type as keyof Items].push({ id: doc.id, name: data.name });
					}
				});
				items.update(currentItems => [...currentItems, newItems]);
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

<header>
	<ThemeSelect lightThemes={['light']} darkThemes={['dark']} />
</header>
{#if userId}
	<slot />
{:else}
	<div class="container">
		<h1>Sign in to continue</h1>
		<p>Sign in to continue to the app</p>
		<button class="btn btn-primary" on:click={() => login()}>Sign in</button>
	</div>
{/if}

<style></style>

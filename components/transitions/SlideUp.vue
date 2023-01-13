<template>
	<transition name="slide-up" mode="out-in" appear>
		<slot />
	</transition>
</template>

<style>
.slide-up-enter-active, .slide-up-leave-active {
	transition: transform .5s;
}

.slide-up-enter-to, .slide-up-leave {
	transform: translateY(0);
}

.slide-up-enter, .slide-up-leave-to {
	transform: translateY(100%);
}
</style>
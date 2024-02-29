<template>
    <ul class="nav nav-underline nav-justified mb-1">
        <li class="nav-item">
            <router-link to="/ideas/page" class="nav-link">This page</router-link>
        </li>
        <li class="nav-item">
            <router-link to="/ideas/saved" class="nav-link">Saved</router-link>
        </li>
    </ul>

    <router-view></router-view>
</template>

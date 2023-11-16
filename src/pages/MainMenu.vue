<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import WebGL from 'frontend-webgl';
import Locale from '../components/Locale.vue';
import SettingsPanel from '../components/General/SettingsPanel.vue';
import PrivacyPanel from '../components/General/PrivacyPanel.vue';
import ReleaseNotesPanel from '../components/General/ReleaseNotesPanel.vue';
import { setMeta } from '../composables/meta.js';
import { ref } from 'vue';

const selectedPanel = ref('');
const setPanel = (newPanel) => selectedPanel.value = newPanel;

setMeta("main_menu")
</script>

<template>
    <WebGL.components.MatrixBgg class="fixed inset-0 w-full h-full" />
    
    <SettingsPanel
        :selectedPanel="selectedPanel"
        :setPanel="setPanel"
    />

    <PrivacyPanel
        :selectedPanel="selectedPanel"
        :setPanel="setPanel"
    />

    <ReleaseNotesPanel
        :selectedPanel="selectedPanel"
        :setPanel="setPanel"
    />

    <UI.Fixed top="auto" bottom="3">
        <div class="w-50 mx-auto">
            <UI.SubTitle class="uppercase text-center text-warning mb-3">
                <Locale id="game_details.title" />
            </UI.SubTitle>

            <UI.Paragraph class="uppercase text-center text-secondary font-bold mb-5">
                <Locale id="main_menu.subtitle" />
            </UI.Paragraph>

            <UI.Flex direction="vertical" gap="1" class="mb-5">
                <UI.Button type="primary" link="/game" class="w-full py-3 font-bold uppercase">
                    <UI.Flex direction="horizontal" items="center" justify="between">
                        <Locale id="main_menu.play_button" />
                        <Icons.fa.PlayIcon width="1em" height="1em" fill="white" />
                    </UI.Flex>
                </UI.Button>

                <UI.Button type="primary" @click="setPanel('settings')" class="w-full py-3 font-bold uppercase">
                    <UI.Flex direction="horizontal" items="center" justify="between">
                        <Locale id="main_menu.settings_button" />
                        <Icons.fa.GearIcon width="1em" height="1em" fill="white" />
                    </UI.Flex>
                </UI.Button>

                <UI.Button type="primary" @click="setPanel('privacy')" class="w-full py-3 font-bold uppercase">
                    <UI.Flex direction="horizontal" items="center" justify="between">
                        <Locale id="main_menu.privacy_button" />
                        <Icons.fa.ShieldIcon width="1em" height="1em" fill="white" />
                    </UI.Flex>
                </UI.Button>

                <UI.Button type="primary" @click="setPanel('release_notes')" class="w-full py-3 font-bold uppercase">
                    <UI.Flex direction="horizontal" items="center" justify="between">
                        <Locale id="main_menu.release_notes_button" />
                        <Icons.fa.ScrollIcon width="1em" height="1em" fill="white" />
                    </UI.Flex>
                </UI.Button>

                <UI.Button type="primary" class="w-full py-3 font-bold uppercase">
                    <UI.Flex direction="horizontal" items="center" justify="between">
                        <Locale id="main_menu.quit_button" />
                        <Icons.fa.StopIcon width="1em" height="1em" fill="white" />
                    </UI.Flex>
                </UI.Button>
            </UI.Flex>

            <UI.Flex direction="horizontal" items="center" justify="center" gap="3"
                class="uppercase font-bold text-center text-xs text-white">
                <span>
                    <Locale id="game_details.version" />
                </span>
                <span class="text-danger">
                    <Locale id="game_details.subtitle" />
                </span>
            </UI.Flex>

        </div>
    </UI.Fixed>

    <UI.Fixed bottom="auto" right="auto" top="1" left="2">
        <UI.Button type="info" class="text-xs w-full py-1 font-bold uppercase">
            <UI.Flex direction="horizontal" items="center" justify="between" gap="1">
                <Icons.fa.StopIcon width="1em" height="1em" fill="white" />
                <Locale id="main_menu.mute_button" />
            </UI.Flex>
        </UI.Button>
    </UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from './General/Locale.vue';
import SettingsPanel from './General/SettingsPanel.vue';
import PrivacyPanel from './General/PrivacyPanel.vue';
import ReleaseNotesPanel from './General/ReleaseNotesPanel.vue';
import Audio from './UI/Audio.vue';
import { usePanel } from '../composables/panel.js';
import { defineEmits } from 'vue';

const emits = defineEmits(['startGame']);
const panelManager = usePanel();
const startGame = () => emits('startGame');
</script>

<template>
    <SettingsPanel />
    <PrivacyPanel />
    <ReleaseNotesPanel />

    <UI.Fixed class="bg-dark">
        <UI.Fixed top="auto" bottom="3">
            <div class="w-50 mx-auto">
                <UI.SubTitle class="uppercase text-center text-warning mb-3">
                    <Locale id="game_details.title" />
                </UI.SubTitle>

                <UI.Paragraph class="uppercase text-center text-secondary font-bold mb-5">
                    <Locale id="main_menu.subtitle" />
                </UI.Paragraph>

                <UI.Flex direction="vertical" gap="1" class="mb-5">
                    <UI.Button type="primary" @click="startGame" class="w-full py-3 font-bold uppercase">
                        <UI.Flex direction="horizontal" items="center" justify="between">
                            <Locale id="main_menu.play_button" />
                            <Icons.fa.PlayIcon width="1em" height="1em" fill="white" />
                        </UI.Flex>
                    </UI.Button>

                    <UI.Button type="primary" @click="panelManager.setPanel('settings')"
                        class="w-full py-3 font-bold uppercase">
                        <UI.Flex direction="horizontal" items="center" justify="between">
                            <Locale id="main_menu.settings_button" />
                            <Icons.fa.GearIcon width="1em" height="1em" fill="white" />
                        </UI.Flex>
                    </UI.Button>

                    <UI.Button type="primary" @click="panelManager.setPanel('privacy')"
                        class="w-full py-3 font-bold uppercase">
                        <UI.Flex direction="horizontal" items="center" justify="between">
                            <Locale id="main_menu.privacy_button" />
                            <Icons.fa.ShieldIcon width="1em" height="1em" fill="white" />
                        </UI.Flex>
                    </UI.Button>

                    <UI.Button type="primary" @click="panelManager.setPanel('release_notes')"
                        class="w-full py-3 font-bold uppercase">
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
            <Audio src="/audio/music_happy_bounce.wav" :volume="0.1" showMute />
        </UI.Fixed>
    </UI.Fixed>
</template>

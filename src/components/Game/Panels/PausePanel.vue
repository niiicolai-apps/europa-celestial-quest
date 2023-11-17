<template>
    <Panel name="paused" identifier="pause">
        <UI.Flex gap="3">
            <UI.Button type="primary" class="w-50" @click="setPanel('settings')">
                <UI.Flex direction="horizontal" justify="between">
                    <UI.Paragraph class="font-bold">
                        Settings
                    </UI.Paragraph>
                    <Icons.fa.GearIcon width="1em" height="1em" fill="white" />
                </UI.Flex>
            </UI.Button>

            <UI.Button type="primary" class="w-50" @click="console.log('not implemented yet')">
                <UI.Flex direction="horizontal" justify="between">
                    <UI.Paragraph class="font-bold">
                        Leaderboard
                    </UI.Paragraph>
                    <Icons.fa.CrownIcon width="1em" height="1em" fill="white" />
                </UI.Flex>
            </UI.Button>

            <UI.Button type="primary" class="w-50" @click="console.log('not implemented yet')">
                <UI.Flex direction="horizontal" justify="between">
                    <UI.Paragraph class="font-bold">
                        Achievements
                    </UI.Paragraph>
                    <Icons.fa.ScrollIcon width="1em" height="1em" fill="white" />
                </UI.Flex>
            </UI.Button>

            <UI.Button type="danger" class="w-50" link="/">
                <UI.Flex direction="horizontal" justify="between">
                    <UI.Paragraph class="font-bold">
                        Quit
                    </UI.Paragraph>
                    <Icons.fa.ArrowRightIcon width="1em" height="1em" fill="white" />
                </UI.Flex>
            </UI.Button>
        </UI.Flex>
    </Panel>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Panel from '../../UI/Panel.vue';
</script>
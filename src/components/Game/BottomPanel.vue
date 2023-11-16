<template>
    <UI.Fixed top="auto" left="1" right="1" bottom="1">
        <UI.Flex 
            direction="horizontal"
            justify="between"
            gap="1">

            <UI.Flex 
            direction="horizontal"
            justify="start"
            gap="1">
                <UI.Button @click="setPanel('shop')" >
                    <Icons.fa.ShopIcon 
                        width="2em" 
                        height="2em"
                        fill="white"
                    />
                </UI.Button>

                <UI.Button @click="setPanel('objectives')" >
                    <Icons.fa.ScrollIcon 
                        width="2em" 
                        height="2em"
                        fill="white"
                    />
                </UI.Button>
                
                <UI.Button @click="setPanel('pause')" >
                    <Icons.fa.PauseIcon 
                        width="2em" 
                        height="2em"
                        fill="white"
                    />
                </UI.Button>
            </UI.Flex>

            
        </UI.Flex>
    </UI.Fixed>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
defineProps({
    selectedPanel: {
        type: String,
        required: true,
    },
    setPanel: {
        type: Function,
        required: true,
    },
})
</script>
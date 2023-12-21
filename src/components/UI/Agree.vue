<template>
    <UI.Flex class="bg-black text-white p-5" 
             justify="start" 
             style="min-height: 100vh;">
        <TransitionGroup name="fade">
            <div v-if="!isInitialized">
                <UI.Flex class="mb-3">
                    <Icons.fa.CircleNotchIcon class="spin" width="2em" height="2em" fill="#1c3148" />
                </UI.Flex>

                <p class="uppercase text-sm font-bold text-center">
                    <Locale :id="loading_locale_id" />
                </p>
            </div>
        </TransitionGroup>


        <TransitionGroup name="fade">
            <div v-if="isDelayed">
                <UI.Flex direction="horizontal" items="center" justify="between" class="w-full mb-5">
                    <div>
                        <p class="uppercase text-lg font-bold mb-2">
                            <Locale :id="title_locale_id" />
                        </p>
                        <p class="text-xs text-danger font-bold">
                            <Locale :id="requirements_locale_id" />
                        </p>
                    </div>

                    <UI.Select type="dark" :options="languageList" :startOption="startLanguageOption"
                        @update:value="updateLanguage" class="w-33" />
                </UI.Flex>

                <UI.Flex direction="horizontal" justify="start" gap="2" class="mb-5">
                    <p class="text-xs">
                        <Locale :id="published_label_locale_id" />:
                        <Locale :id="published_date_locale_id" />
                    </p>

                    <p class="text-xs">
                        <Locale :id="updated_label_locale_id" />:
                        <Locale :id="updated_date_locale_id" />
                    </p>
                </UI.Flex>

                <p v-if="newModificationDateValue" class="text-xs text-warning font-bold mb-5">
                    <Locale :id="new_modifications_locale_id" />: {{ newModificationDateValue }}
                </p>

                <slot />

                <UI.Button type="success" @click="accept" class="w-full py-3 font-bold uppercase">
                    <Locale :id="accept_button_locale_id" />
                </UI.Button>
            </div>
        </TransitionGroup>
    </UI.Flex>
</template>

<script setup>
import UI from 'frontend-ui';
import Icons from 'frontend-icons';
import Locale from '../General/Locale.vue';
import PersistentData from '../../game/persistent_data/persistent_data.js';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useLocalization } from '../../composables/localization.js';

const props = defineProps({
    title_locale_id: {
        type: String,
        default: 'software_licens.title'
    },
    loading_locale_id: {
        type: String,
        default: 'software_licens.loading'
    },
    requirements_locale_id: {
        type: String,
        default: 'software_licens.requirements'
    },
    published_label_locale_id: {
        type: String,
        default: 'software_licens.published.label'
    },
    published_date_locale_id: {
        type: String,
        default: 'software_licens.published.date'
    },
    updated_label_locale_id: {
        type: String,
        default: 'software_licens.updated.label'
    },
    updated_date_locale_id: {
        type: String,
        default: 'software_licens.updated.date'
    },
    new_modifications_locale_id: {
        type: String,
        default: 'software_licens.new_modifications'
    },
    accept_button_locale_id: {
        type: String,
        default: 'software_licens.accept_button'
    },
    persistent_data_key: {
        type: String,
        default: 'software_licens'
    },
    accept: {
        type: Function,
        required: true,
    }
})

const localizationManager = useLocalization();

const defaultLanguage = localizationManager.LANGUAGE.value;
const startLanguageOption = ref({ label: defaultLanguage, value: defaultLanguage });
const updateLanguage = (option) => localizationManager.setLanguage(option.value);
const languageList = computed(() => Object.values(localizationManager.LANGUAGE_TYPES).map(l => {
    return { label: l, value: l }
}))

const lastModificationDate = ref(null);
const newModificationDate = ref(null);
const isInitialized = ref(false);
const isDelayed = ref(false);
const delay = 1000;
const accept = () => {
    const data = { accepted: true, date: lastModificationDate.value };
    PersistentData.set(props.persistent_data_key, data);
    props.accept();
}

const newModificationDateValue = computed(() => {
    if (!newModificationDate.value) return null;
    return `${newModificationDate.value.getDate()}/${newModificationDate.value.getMonth()}/${newModificationDate.value.getFullYear()}`;
})

onMounted(async () => {
    const localeDate = localizationManager.getLocale(props.updated_date_locale_id);
    lastModificationDate.value = new Date(localeDate);

    const pdData = await PersistentData.get(props.persistent_data_key);
    if (pdData && pdData.accepted) {
        const pdDate = new Date(pdData.date);
        if (pdDate.getDate() >= lastModificationDate.value.getDate() &&
            pdDate.getMonth() >= lastModificationDate.value.getMonth() &&
            pdDate.getFullYear() >= lastModificationDate.value.getFullYear()) {
            props.accept();
            return;
        }

        newModificationDate.value = pdDate;
    }

    const pdLanguage = await PersistentData.get('language');
    if (pdLanguage) {
        const language = pdLanguage.lang;
        startLanguageOption.value = { label: language, value: language };
        localizationManager.setLanguage(language);
    }

    isInitialized.value = true;
    setTimeout(() => isDelayed.value = true, delay);
})

onUnmounted(async () => {
    isInitialized.value = false;
    isDelayed.value = false;
})
</script>

<style scoped>
.spin {
    animation: spin .8s infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
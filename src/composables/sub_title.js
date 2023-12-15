import { ref } from 'vue';

const show = ref(false);
const localeId = ref(null);

export const useSubTitle = () => {

    const showSubTitle = (id) => {
        localeId.value = id;
        show.value = true;
    }
    
    const hideSubTitle = () => {
        show.value = false;
    }

    return {
        showSubTitle,
        hideSubTitle,
        show,
        localeId,
    }
}

import MapJson from '../map/map1.json'
import { ref } from 'vue'

const map = ref(MapJson)

export const useMap = () => {
    return {
        map,
    }
}

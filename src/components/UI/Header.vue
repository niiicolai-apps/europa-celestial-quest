<template>
    <div>
        <div>
            <span>
                <Locale id="header.title" />
            </span>

            <div>
                <Link 
                    to="/"
                    :class="isActive('main_menu')"
                >
                    <Locale id="header.link.home" />
                </Link>
            </div>
        </div>
    </div>
</template>

<script setup>
import Link from './Link.vue';
import Locale from '../Locale.vue';

const props = defineProps({
    active: {
        type: String,
        required: true,
    },
})

const isActive = (page) => {
    return props.active === page ? 'text-green-500' : 'text-green-300';
}
</script>
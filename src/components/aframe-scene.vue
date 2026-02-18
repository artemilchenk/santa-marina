<template>
  <a-scene
    v-bind="attributes"
    :id="sceneId"
    ref="scene"
    :class="sceneClass"
  >
    <AframeAssets
      :models="models"
      :images="images"
      :cubemaps="cubemaps"
      :audios="audios"
      :videos="videos"
      :timeout="timeout"
      :on-loaded="onLoaded"
      @vue:mounted="mountAssets"
    />
    <slot v-if="assetsMounted" />
  </a-scene>
</template>

<script setup>
  import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
  import AframeAssets from './aframe-assets.vue';

  const props = defineProps({
    sceneRefSetterCallback: {
      type: Function,
      required: false,
      default: () => {}
    },
    models: {
      type: Array,
      required: false,
      default: () => []
    },
    images: {
      type: Array,
      required: false,
      default: () => []
    },
    cubemaps: {
      type: Array,
      required: false,
      default: () => []
    },
    audios: {
      type: Array,
      required: false,
      default: () => []
    },
    videos: {
      type: Array,
      required: false,
      default: () => []
    },
    attributes: {
      type: Object,
      required: false,
      default: () => ({})
    },
    systems: {
      type: Object,
      required: false,
      default: () => ({})
    },
    components: {
      type: Object,
      required: false,
      default: () => ({})
    },
    shaders: {
      type: Object,
      required: false,
      default: () => ({})
    },
    listeners: {
      type: Object,
      required: false,
      default: () => ({})
    },
    timeout: {
      type: Number,
      required: false,
      default: 10000
    },
    sceneId: {
      type: String,
      required: false,
      default: ''
    },
    sceneClass: {
      type: String,
      required: false,
      default: ''
    },
    onLoaded: {
      type: Function,
      required: false,
      default: () => {}
    }
  });

  const assetsMounted = ref(false);
  const scene = ref(null);

  const mountAssets = () => {
    assetsMounted.value = true;
  };

  const registerSystems = (s) => {
    Object.keys(s).forEach((k) => AFRAME.registerSystem(k, s[k]));
  };

  const registerComponents = (c) => {
    Object.keys(c).forEach((k) => AFRAME.registerComponent(k, c[k]));
  };

  const registerShaders = (s) => {
    Object.keys(s).forEach((k) => AFRAME.registerShader(k, s[k]));
  };

  const attachListeners = () => {
    Object.entries(props.listeners).forEach(([event, handler]) => {
      scene.value.addEventListener(event, handler);
    });
  };

  const deregisterComponents = (components) => {
    Object.keys(scene.value.components).map((component) => {
      scene.value.removeAttribute(component);
      return true;
    });
    scene.value.querySelectorAll('*').forEach((el) => {
      if (el && el.components) {
        Object.keys(el.components).map((component) => {
          el.removeAttribute(component);
          return true;
        });
      }
    });
    Object.keys(components).map((k) => delete AFRAME.components[k]);
  };

  const removeListeners = () => {
    Object.entries(props.listeners).forEach(([event, handler]) => {
      scene.value.removeEventListener(event, handler);
    });
  };

  onBeforeMount(() => {
    registerComponents(props.components);
    registerSystems(props.systems);
    registerShaders(props.shaders);
  });

  onMounted(async () => {
    attachListeners();
    props.sceneRefSetterCallback(scene.value);
  });

  onBeforeUnmount(() => {
    deregisterComponents(props.components);
    removeListeners();
  });
</script>

import { type Ref } from 'vue';
import { AFRAME_SCENES } from '~/mocks/aframe-scene';
import {
  EAframe3DObjectType,
  type ICoordinates,
  type IEditActiveAframeSceneProps,
  type TActiveAframeScene
} from '~/types/aframe-scene';
import { EScreenName } from '~/types/screen';

interface IState {
  hasGyroscopeAccess: Ref<boolean>;
  isAssetsLoaded: Ref<boolean>;
  isBackPortalOnScreen: Ref<boolean>;
  activeSceneData: Ref<TActiveAframeScene | null>;
  visitedScenes: Ref<TActiveAframeScene[]>;
  mtxDisplacementPos: Ref<ICoordinates>;
}

interface IActions {
  setHasGyroscopeAccess: (hasAccess: boolean) => void;
  setIsAssetsLoaded: (isLoaded: boolean) => void;
  setIsBackPortalOnScreen: (isOnScreen: boolean) => void;
  initSceneData: () => void;
  setActiveSceneData: () => void;
  editActiveSceneData: <T extends EAframe3DObjectType>(edited: IEditActiveAframeSceneProps<T>) => void;
  setVisitedScenes: (visitedScene: TActiveAframeScene) => void;
  updateMtxDisplacementPos: (reset?: boolean) => void;
}

export const useAframeStore = defineStore('aframe-store', () => {
  const appStore = useAppStore();

  const hasGyroscopeAccess: IState['hasGyroscopeAccess'] = ref(false);
  const isAssetsLoaded: IState['isAssetsLoaded'] = ref(false);
  const isBackPortalOnScreen: IState['isBackPortalOnScreen'] = ref(false);
  const activeSceneData: IState['activeSceneData'] = ref(null);
  const visitedScene: IState['visitedScenes'] = ref([]);
  const mtxDisplacementPos: IState['mtxDisplacementPos'] = ref({ x: 0, y: 0, z: 0 });

  const setHasGyroscopeAccess: IActions['setHasGyroscopeAccess'] = (hasAccess) => {
    hasGyroscopeAccess.value = hasAccess;
  };

  const setIsAssetsLoaded: IActions['setIsAssetsLoaded'] = (isLoaded) => {
    isAssetsLoaded.value = isLoaded;
  };

  const setIsBackPortalOnScreen: IActions['setIsBackPortalOnScreen'] = (isOnScreen) => {
    isBackPortalOnScreen.value = isOnScreen;
  };

  const setVisitedSceneScenes: IActions['setVisitedScenes'] = (scene) => {
    if (visitedScene.value.length === 0) {
      visitedScene.value.push(scene);
      return;
    }

    const sceneIndex = visitedScene.value.findIndex((item) => item.name === scene.name);

    if (sceneIndex === -1 || !visitedScene.value[sceneIndex]) {
      visitedScene.value.push(scene);
      return;
    }

    visitedScene.value[sceneIndex] = { ...scene };
  };

  const setActiveSceneData: IActions['setActiveSceneData'] = () => {
    if (appStore.screenName === EScreenName.START) {
      activeSceneData.value = null;
      return;
    }

    const visitedSceneData = visitedScene.value.find((item) => item.name === appStore.screenName);

    if (visitedSceneData) {
      activeSceneData.value = { ...visitedSceneData };
      return;
    }

    const sceneData = AFRAME_SCENES.find((item) => item.name === appStore.screenName);
    if (!sceneData) {
      const sceneMainData = AFRAME_SCENES.find((item) => item.name === EScreenName.MAIN);

      if (!sceneMainData) {
        activeSceneData.value = null;
        return;
      }

      activeSceneData.value = {
        name: sceneMainData.name,
        type: sceneMainData.type,
        mtxSceneCoords: sceneMainData.mtxSceneCoords,
        data: {
          portals: sceneMainData.data.portals,
          hotspots: sceneMainData.data.hotspots
        }
      };
      return;
    }

    const newSceneData = {
      name: sceneData.name,
      type: sceneData.type,
      mtxSceneCoords: sceneData.mtxSceneCoords,
      data: {
        portals: sceneData.data.portals,
        // hotspots: sceneData.type === EAframeSceneType.HOTSPOTS ? sceneData.data.hotspots : []
        hotspots: sceneData.data.hotspots
      }
    };

    activeSceneData.value = newSceneData;
    setVisitedSceneScenes(newSceneData);
  };

  const editActiveSceneData: IActions['editActiveSceneData'] = (edited) => {
    if (!activeSceneData.value || (Object.keys(edited.data).length === 0 && edited.data.constructor === Object)) {
      return;
    }

    const objectField = edited.type === EAframe3DObjectType.HOTSPOT ? 'hotspots' : 'portals';
    const objectArray = activeSceneData.value.data[objectField];
    const allDataObject = objectArray.find((item) => item.id === edited.id);

    if (!allDataObject) {
      return;
    }

    const activeSceneDataSnapshot = { ...activeSceneData.value };
    activeSceneData.value = {
      ...activeSceneDataSnapshot,
      data: {
        ...activeSceneData.value.data,
        [objectField]: [
          ...objectArray.filter((item) => item.id !== edited.id),
          {
            ...allDataObject,
            ...edited.data
          }
        ]
      }
    };

    setVisitedSceneScenes(activeSceneData.value);
  };

  const updateMtxDisplacementPos: IActions['updateMtxDisplacementPos'] = (reset) => {
    const location = AFRAME_SCENES.find((scene) => scene.name === appStore.screenName);
    mtxDisplacementPos.value = reset ? { x: 0, y: 0, z: 0 } : location?.mtxSceneCoords || { x: 0, y: 0, z: 0 };
  };

  return {
    hasGyroscopeAccess,
    isAssetsLoaded,
    isBackPortalOnScreen,
    visitedScene,
    activeSceneData,
    mtxDisplacementPos,
    setHasGyroscopeAccess,
    setIsAssetsLoaded,
    setIsBackPortalOnScreen,
    setVisitedSceneScenes,
    setActiveSceneData,
    editActiveSceneData,
    updateMtxDisplacementPos
  };
});

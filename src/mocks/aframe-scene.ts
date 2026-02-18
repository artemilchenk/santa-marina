import SkyBoxImageMain from '~/assets/images/lobby/360-lobby.jpg';
import SkyBoxImageAdventure from '~/assets/images/adventure/360-adventure.jpg';
import SkyBoxImageSustainability from '~/assets/images/sustainability/360-sustainability.jpg';
import SkyBoxImageWellness from '~/assets/images/wellness/360-wellness.jpg';

import SkyBoxVideoMain from '~/assets/videos/360-lobby.mp4';
import SkyBoxVideoAdventure from '~/assets/videos/360-adventure.mp4';
import SkyBoxVideoSustainability from '~/assets/videos/360-sustainability.mp4';
import SkyBoxVideoWellness from '~/assets/videos/360-Wellness.mp4';

import AmbienceSoundMain from '~/assets/sounds/lobby-ambience.mp3';
import AmbienceSoundAdventure from '~/assets/sounds/adventure-ambience.mp3';
import AmbienceSoundSustainability from '~/assets/sounds/sustainability-ambience.mp3';
import AmbienceSoundWellness from '~/assets/sounds/wellness-ambience.mp3';

import HotspotMainImage1 from '~/assets/images/lobby/hotspot-1.jpg';

import HotspotAdventureImage1 from '~/assets/images/adventure/hotspot-1.jpg';
import HotspotAdventureImage2 from '~/assets/images/adventure/hotspot-2.jpg';
import HotspotAdventureVideo from '~/assets/videos/hotspot-adventure.mp4';

import HotspotSustainabilityImage1 from '~/assets/images/sustainability/hotspot-1.jpg';
import HotspotSustainabilityImage2 from '~/assets/images/sustainability/hotspot-2.jpg';
import HotspotSustainabilityVideo from '~/assets/videos/hotspot-sustainability.mp4';

import HotspotWellnessImage1 from '~/assets/images/wellness/hotspot-1.jpg';
import HotspotWellnessImage2 from '~/assets/images/wellness/hotspot-2.jpg';
import HotspotWellnessVideo1 from '~/assets/videos/wellness-hotspot-2.mp4';
import HotspotWellnessVideo2 from '~/assets/videos/wellness-hotspot-3.mp4';

import { EAframeSceneType, type TAframeScene } from '~/types/aframe-scene';
import { EHotspotContentMediaType, EHotspotContentType, EHotspotType } from '~/types/hotspot';
import { EScreenName } from '~/types/screen';
import { EPortalType } from '~/types/portal';

export const AFRAME_SCENES: TAframeScene[] = [
  {
    name: EScreenName.MAIN,
    type: EAframeSceneType.MAIN,
    mtxSceneCoords: {
      x: 0,
      y: 0,
      z: -110
    },
    data: {
      skybox: {
        image: {
          src: SkyBoxImageMain,
          rotation: {
            x: 0,
            y: -92,
            z: 0
          }
        },
        video: {
          src: SkyBoxVideoMain,
          rotation: {
            x: 0,
            y: -92,
            z: 0
          }
        },
        audio: {
          src: AmbienceSoundMain,
          loop: true
        }
      },
      portals: [
        {
          id: EScreenName.MAIN + '-portal-01',
          type: EPortalType.ENTRANCE,
          coordinates: {
            x: -0.98,
            y: 1.5,
            z: -3.5
          },
          isVisible: true,
          isClickable: true,
          from: EScreenName.MAIN,
          to: EScreenName.ADVENTURE
        },
        {
          id: EScreenName.MAIN + '-portal-02',
          type: EPortalType.ENTRANCE,
          coordinates: {
            x: 1.35,
            y: 1.5,
            z: -3.8
          },
          isVisible: true,
          isClickable: true,
          from: EScreenName.MAIN,
          to: EScreenName.SUSTAINABILITY
        },
        {
          id: EScreenName.MAIN + '-portal-03',
          type: EPortalType.ENTRANCE,
          coordinates: {
            x: 0,
            y: 2.3,
            z: -5.5
          },
          isVisible: true,
          isClickable: true,
          from: EScreenName.MAIN,
          to: EScreenName.WELLNESS
        }
      ],
      hotspots: [
        {
          id: EScreenName.MAIN + '-hotspot-01',
          coordinates: {
            x: -0.68,
            y: -0.83,
            z: -11
          },
          isChecked: false,
          isActive: false,
          isVisible: true,
          isClickable: true,
          type: EHotspotType.QUESTION,
          content: {
            type: EHotspotContentType.COMMON,
            data: {
              media: {
                type: EHotspotContentMediaType.IMAGE,
                src: HotspotMainImage1
              },
              title: 'Your window into Costa Rica',
              description:
                'Dive into the lush forests, pristine waters and stunning beaches. Click through each energy portal to make new discoveries about this natural paradise. If you look closely at each element, you may find bonus experiences.'
            }
          }
        }
      ]
    }
  },
  {
    name: EScreenName.ADVENTURE,
    type: EAframeSceneType.HOTSPOTS,
    mtxSceneCoords: {
      x: -110,
      y: 0,
      z: -220
    },
    data: {
      skybox: {
        image: {
          src: SkyBoxImageAdventure,
          rotation: {
            x: 0,
            y: -80,
            z: 0
          }
        },
        video: {
          src: SkyBoxVideoAdventure,
          rotation: {
            x: 0,
            y: -80,
            z: 0
          }
        },
        audio: {
          src: AmbienceSoundAdventure,
          loop: true
        }
      },
      portals: [
        {
          id: EScreenName.ADVENTURE + '-portal-01',
          type: EPortalType.EXIT,
          coordinates: {
            x: 14.3,
            y: -0.36,
            z: 3.25
          },
          size: {
            depth: 5,
            height: 5,
            width: 5
          },
          isVisible: true,
          isClickable: true,
          from: EScreenName.ADVENTURE,
          to: EScreenName.MAIN
        }
      ],
      hotspots: [
        {
          id: EScreenName.ADVENTURE + '-hotspot-01',
          coordinates: {
            x: 1.26,
            y: 0.22,
            z: -11.52
          },
          isChecked: false,
          isActive: false,
          isVisible: true,
          isClickable: true,
          type: EHotspotType.INFO,
          content: {
            type: EHotspotContentType.COMMON,
            data: {
              media: {
                type: EHotspotContentMediaType.VIDEO,
                src: HotspotAdventureVideo
              },
              title: 'Explore towering volcanos.',
              description:
                'Arenal Volcano soars over the surrounding national park, Lake Arenal and surrounding towns. Its remarkable beauty serves as the backdrop for kayaking trips, horseback riding expeditions, canopy tours, white-water rafting adventures and zip lining thrills.\n' +
                '\n' +
                'While Costa Rica is home to dozens of extinct or dormant volcanoes, five are still active and generating heat for many natural hot springs.'
            }
          }
        },
        {
          id: EScreenName.ADVENTURE + '-hotspot-02',
          coordinates: {
            x: 1.08,
            y: 0.11,
            z: -3.02
          },
          isChecked: false,
          isActive: false,
          isVisible: true,
          isClickable: true,
          type: EHotspotType.INFO,
          content: {
            type: EHotspotContentType.COMMON,
            data: {
              media: {
                type: EHotspotContentMediaType.IMAGE,
                src: HotspotAdventureImage1
              },
              title: 'See the wonder up close.',
              description:
                'Curious adventurers embark on treks through the cloud forests, rainforests, mangroves and lagoons of Costa Rica. Those who are brave enough can explore hanging bridges and aerial trams for a bird’s-eye view of the beauty. The pristine nature makes you feel like you’ve gone back in time and lets you connect deeply with the vibrant world around you.'
            }
          }
        },
        {
          id: EScreenName.ADVENTURE + '-hotspot-03',
          coordinates: {
            x: -7.58,
            y: 0,
            z: -2.54
          },
          isChecked: false,
          isActive: false,
          isVisible: true,
          isClickable: true,
          type: EHotspotType.INFO,
          content: {
            type: EHotspotContentType.COMMON,
            data: {
              media: {
                type: EHotspotContentMediaType.IMAGE,
                src: HotspotAdventureImage2
              },
              title: "Surf's up.",
              description:
                'Costa Rica has stunning beaches on both the Pacific and Caribbean sides, which means visitors can find world-class surfing year-round. A mix of beach breaks, point breaks and reef breaks offers options for any skill level.\n' +
                '\n' +
                'If you love the water but aren’t looking to surf, you can try paddle boarding or kayaking at beaches, lakes, and mangroves.'
            }
          }
        }
      ]
    }
  },
  {
    name: EScreenName.SUSTAINABILITY,
    type: EAframeSceneType.HOTSPOTS,
    mtxSceneCoords: {
      x: 110,
      y: 0,
      z: -220
    },
    data: {
      skybox: {
        image: {
          src: SkyBoxImageSustainability,
          rotation: {
            x: 0,
            y: -85,
            z: 0
          }
        },
        video: {
          src: SkyBoxVideoSustainability,
          rotation: {
            x: 0,
            y: -85,
            z: 0
          }
        },
        audio: {
          src: AmbienceSoundSustainability,
          loop: true
        }
      },
      portals: [
        {
          id: EScreenName.SUSTAINABILITY + '-portal-01',
          type: EPortalType.EXIT,
          coordinates: {
            x: -3.51,
            y: 0.69,
            z: 8.56
          },
          size: {
            depth: 3,
            height: 3,
            width: 3
          },
          isVisible: true,
          isClickable: true,
          from: EScreenName.SUSTAINABILITY,
          to: EScreenName.MAIN
        }
      ],
      hotspots: [
        {
          id: EScreenName.SUSTAINABILITY + '-hotspot-01',
          coordinates: {
            x: -8.36,
            y: -0.27,
            z: 2.58
          },
          isChecked: false,
          isActive: false,
          isVisible: true,
          isClickable: true,
          type: EHotspotType.INFO,
          content: {
            type: EHotspotContentType.COMMON,
            data: {
              media: {
                type: EHotspotContentMediaType.IMAGE,
                src: HotspotSustainabilityImage1
              },
              title: 'Let nature put on a show.',
              description:
              'More than 25% of land in Costa Rica is reserved for conservation. With habitats protected, visitors can see a dazzling array of tropical flora and fauna. You could spot capuchins, howler monkeys, harpy eagles and, of course, our iconic sloths.\n' +
              '\n' +
              'On the aquatic side, marine reserves and sanctuaries provide some of the most impressive diving and snorkeling experiences, including coral reefs. Our central global location also means that whales and dolphins migrate through our waters from both hemispheres, giving visitors a relatively strong chance of seeing them on a boat tour or sometimes from the beach.'
            }
          }
        },
        {
          id: EScreenName.SUSTAINABILITY + '-hotspot-02',
          coordinates: {
            x: -8.51,
            y: 0.3,
            z: -5
          },
          isChecked: false,
          isActive: false,
          isVisible: true,
          isClickable: true,
          type: EHotspotType.INFO,
          content: {
            type: EHotspotContentType.COMMON,
            data: {
              media: {
                type: EHotspotContentMediaType.IMAGE,
                src: HotspotSustainabilityImage2
              },
              title: 'Beauty takes flight.',
              description:
                'More than 900 species of birds can be spied in the wilds of Costa Rica. There are more than 50 species of hummingbirds alone. Birders from across the world come here to spy scarlet macaws, toucans and quetzals, among others. And a dedicated few will spot truly rare finds like a three-wattled bellbird, crested eagle or a lattice-tailed trogon.'
            }
          }
        },
        {
          id: EScreenName.SUSTAINABILITY + '-hotspot-03',
          coordinates: {
            x: 4.96,
            y: -0.13,
            z: -5
          },
          isChecked: false,
          isActive: false,
          isVisible: true,
          isClickable: true,
          type: EHotspotType.INFO,
          content: {
            type: EHotspotContentType.COMMON,
            data: {
              media: {
                type: EHotspotContentMediaType.VIDEO,
                src: HotspotSustainabilityVideo
              },
              title: 'Science protects beauty.',
              description:
                'Not only is Costa Rica protecting its wildlife for today, we’re studying it to create a stronger understanding for the future. Scientists monitor important topics such as forest dynamics and nutrient cycling. They record the effects of global change and human-nature interactions. Researchers also track specific species to protect their populations. Visitors can see natural spectacles such as sea turtle hatchings in protected sites.'
            }
          }
        }
      ]
    }
  },
  {
    name: EScreenName.WELLNESS,
    type: EAframeSceneType.HOTSPOTS,
    mtxSceneCoords: {
      x: 0,
      y: 0,
      z: -220
    },
    data: {
      skybox: {
        image: {
          src: SkyBoxImageWellness,
          rotation: {
            x: 0,
            y: -85,
            z: 0
          }
        },
        video: {
          src: SkyBoxVideoWellness,
          rotation: {
            x: 0,
            y: -85,
            z: 0
          }
        },
        audio: {
          src: AmbienceSoundWellness,
          loop: true
        }
      },
      portals: [
        {
          id: EScreenName.WELLNESS + '-portal-01',
          type: EPortalType.EXIT,
          coordinates: {
            x: -0.82,
            y: 1.15,
            z: 7.6
          },
          size: {
            depth: 3,
            height: 3,
            width: 3
          },
          isVisible: true,
          isClickable: true,
          from: EScreenName.WELLNESS,
          to: EScreenName.MAIN
        }
      ],
      hotspots: [
        {
          id: EScreenName.WELLNESS + '-hotspot-01',
          coordinates: {
            x: 4.2,
            y: -0.8,
            z: -5
          },
          isChecked: false,
          isActive: false,
          isVisible: true,
          isClickable: true,
          type: EHotspotType.INFO,
          content: {
            type: EHotspotContentType.COMMON,
            data: {
              media: {
                type: EHotspotContentMediaType.IMAGE,
                src: HotspotWellnessImage1
              },
              title: 'Seek what fuels you.',
              description:
              'Discover spas and wellness retreats nestled in lush natural beauty. Soak in geothermal hot springs, nature bathe in the depths of the jungle and receive expert spa treatments. Hydrotherapy, massage, facials, body wraps and sound baths are some of the most popular options. For those traveling for relaxation, Costa Rica’s profound connection with nature provides an unmatched healing experience.'
            }
          }
        },
        {
          id: EScreenName.WELLNESS + '-hotspot-02',
          coordinates: {
            x: 2.3,
            y: 4.35,
            z: -6.3
          },
          isChecked: false,
          isActive: false,
          isVisible: true,
          isClickable: true,
          type: EHotspotType.INFO,
          content: {
            type: EHotspotContentType.COMMON,
            data: {
              media: {
                type: EHotspotContentMediaType.IMAGE,
                src: HotspotWellnessImage2
              },
              title: 'Happiness comes in waves.',
              description:
              'Everyone deserves the peace and restoration found on the seashore, which is why Costa Rica’s beaches are all open to the public. Visitors and locals alike adore the white- and black-sand beaches on both of the country’s coasts.\n' +
              '\n' +
              'Local restaurants offer fresh coconuts and more fresh fruit to add further health benefits to a day at the shore. And depending on the time of year, beachgoers may spot whales or dolphins on their yearly migrations.'
            }
          }
        },
        {
          id: EScreenName.WELLNESS + '-hotspot-03',
          coordinates: {
            x: 4,
            y: 0.6,
            z: 0
          },
          isChecked: false,
          isActive: false,
          isVisible: true,
          isClickable: true,
          type: EHotspotType.INFO,
          content: {
            type: EHotspotContentType.VIDEO,
            data: {
              title: 'Breathe in as the ball moves up.',
              video: HotspotWellnessVideo1
            }
          }
        },
        {
          id: EScreenName.WELLNESS + '-hotspot-04',
          coordinates: {
            x: -3.5,
            y: 0.5,
            z: -5
          },
          isChecked: false,
          isActive: false,
          isVisible: true,
          isClickable: true,
          type: EHotspotType.INFO,
          content: {
            type: EHotspotContentType.COMMON,
            data: {
              media: {
                type: EHotspotContentMediaType.VIDEO,
                src: HotspotWellnessVideo2
              },
              title: 'Find peace on purpose.',
              description:
              'Wellness comes naturally in Costa Rica. The Nicoya Peninsula is one of the world’s Blue Zones, a rare area where inhabitants live longer, healthier lives. With fresh food, a focus on movement and strong community connection, this lifestyle serves as a great guide for visitors looking to refocus their priorities.\n' +
              '\n' +
              'Across the country, pura vida isn’t only a phrase, it’s an energy. It’s used as a greeting, a reply to someone asking how you are and a confident, optimistic response to daily challenges. Pura vida is a relaxed, joyful energy that celebrates our connections to each other and the earth.'
            }
          }
        }
      ]
    }
  }
];

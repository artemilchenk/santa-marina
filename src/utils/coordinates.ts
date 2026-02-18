import type { ICoordinates } from '~/types/aframe-scene';

export const isCoordinatesValid = (coordinates: ICoordinates | string) => {
  const coordinatesString =
    typeof coordinates === 'string' ? coordinates : `${coordinates.x} ${coordinates.y} ${coordinates.z}`;

  return coordinatesString.split(' ').every((item) => Number.isFinite(+item));
};

export const coordinatesToText = (coordinates: ICoordinates) => {
  return `${coordinates.x} ${coordinates.y} ${coordinates.z}`;
};

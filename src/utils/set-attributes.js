// /////////////////////////////////////////////
// Set attributes more legibly, using an object.
//
// const entity = document.createElement('a-entity')
// setAttributes(entity, {
//   'id': 'example',
//   'class': 'canTap anotherClass',
//   'position': '0 2 -5',
//   'rotation': '0 45 0',
// })
// /////////////////////////////////////////////

export const setAttributes = (el, attributes) => {
  const attributeArray = Object.entries(attributes);
  attributeArray.forEach((attribute) => {
    el.setAttribute(attribute[0], attribute[1]);
  });
};

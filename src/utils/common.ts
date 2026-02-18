export const replaceCurrentWord = (sentence: string, targetWord: string, replacementWord: string) => {
  const regex = new RegExp(`\\b${targetWord}\\b`, 'g');
  return sentence.replace(regex, replacementWord);
};

export const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

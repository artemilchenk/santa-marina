export const copyIt = async (text: string, showAlert?: boolean) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);

    if (showAlert) alert('Link copied to clipboard');
  } else {
    console.warn('Clipboard API is not supported');
  }
};

export const shareIt = async (title: string, text: string, url: string) => {
  const shareData = { title, text, url };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      console.log('share success');
    } catch (err) {
      console.error('Error sharing: ', err);
      await copyIt(`${shareData.text} ${shareData.url}`);
    }
  } else {
    console.warn('Web Share API is not supported');
    await copyIt(`${shareData.text} ${shareData.url}`);
  }
};

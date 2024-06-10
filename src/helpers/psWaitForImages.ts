// Helper function that waits for all images with provide selector to load before continue

// Usage:
// waitForImages('.selector').then((imagesLoaded) => {
//     if (imagesLoaded) {
//         ... code here
//     }
// });

// MAke sure IMGs are eagerly loaded!! :)

export function waitForImages(selector: string): Promise<boolean> {
  // console.log('wait called' + selector);
  const images = document.querySelectorAll<HTMLImageElement>(selector);
  // console.log('imgl= ' + images.length);

  // console.log(selector);
  // console.log(images.length);

  return new Promise((resolve) => {
    if (images.length === 0) {
      resolve(true); // No images to load
    }

    let loadedImagesCount: number = 0;
    let imagesLoaded: boolean = true;

    images.forEach((img) => {
      if (img.complete && img.naturalWidth !== 0) {
        loadedImagesCount += 1;
      } else {
        img.addEventListener('load', () => {
          loadedImagesCount += 1;
          if (loadedImagesCount === images.length) {
            resolve(imagesLoaded);
          }
        });

        img.addEventListener('error', () => {
          imagesLoaded = false;
          loadedImagesCount += 1;
          if (loadedImagesCount === images.length) {
            resolve(imagesLoaded);
          }
        });
      }
    });

    if (loadedImagesCount === images.length) {
      resolve(imagesLoaded); // All images were already loaded
    }
  });
}

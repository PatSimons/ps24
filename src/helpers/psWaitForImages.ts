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

  // Filter out images that have any parent with the class 'w-condition-invisible'
  const visibleImages = Array.from(images).filter((img) => !img.closest('.w-condition-invisible'));

  //console.log('Total images: ' + images.length);
  //console.log('Total visible images: ' + visibleImages.length);

  // console.log(selector);
  //console.log(images.length);

  return new Promise((resolve) => {
    if (visibleImages.length === 0) {
      resolve(true); // No images to load
      //console.log('No images to load');
    }
    // // Define a type for the callback function
    // type Callback = () => void;

    // function conditionalCallback(condition: boolean, callback: Callback) {
    //   if (condition) {
    //     callback();
    //   }
    // }
    //_______________________________________________________________________________________________________ Add all external Video to the ImgCollection list
    // Select all elements with the attribute [cs-el="projectVideo"]
    // const videosList = document.querySelector<HTMLElement>('[cs-el="extVideos"]');
    // if (videosList) {
    //   const projectVideos = videosList?.querySelectorAll<HTMLElement>('[cs-el="projectImgItem"]');
    //   const projectImgList = document.querySelector<HTMLElement>('[cs-el="projectImgList"]');
    //   //const originalChildren = projectImgList?.querySelectorAll('div');

    //   if (projectVideos.length > 0 && projectImgList) {
    //     // Calculate the position to insert the video

    //     // Append each projectVideo element to the parent1 element
    //     projectVideos.forEach((video, index: number) => {
    //       //const position = index * 2 + 1;
    //       projectImgList.appendChild(video);
    //       //projectImgList.insertBefore(video, projectImgList.childNodes[position]);
    //     });
    //   }
    // }

    let loadedImagesCount: number = 0;
    let imagesLoaded: boolean = true;

    visibleImages.forEach((img) => {
      // const isInvisible = img.closest('.w-condition-invisible') !== null;

      // if (!isInvisible) {
      if (img.complete && img.naturalWidth !== 0) {
        loadedImagesCount += 1;
        //console.log('load img > ' + loadedImagesCount);
      } else {
        img.addEventListener('load', () => {
          loadedImagesCount += 1;
          if (loadedImagesCount === visibleImages.length) {
            resolve(imagesLoaded);
          }
          //console.log('load');
        });

        img.addEventListener('error', () => {
          imagesLoaded = false;
          loadedImagesCount += 1;
          if (loadedImagesCount === visibleImages.length) {
            resolve(imagesLoaded);
          }
          //console.log('error');
        });
      }
      //}
    });

    if (loadedImagesCount === visibleImages.length) {
      resolve(imagesLoaded); // All images are loaded
      //console.log(loadedImagesCount + ' images were loaded');
    }
  });
}

export const getMyLocation = (): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser"));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve([
          position.coords.longitude,
          position.coords.latitude,
        ]);
      },
      (error) => {
        reject(error);
      }
    );
  });
};
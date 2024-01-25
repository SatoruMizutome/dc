export function distance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ) {
    lat1 *= Math.PI / 180;
    lng1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    lng2 *= Math.PI / 180;
    return (
      6371 *
      Math.acos(
        Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
          Math.sin(lat1) * Math.sin(lat2),
      )
    );
  }
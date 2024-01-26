import React, { useEffect, useState } from "react";

const LocationUpdater = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    console.log("sebelum", location);
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        console.log("sesudah", location);
      },
      (error) => {
        console.error(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      } // Atur interval pembaruan (distanceFilter dalam meter)
    );

    // Bersihkan langganan saat komponen dilepas
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div>
      {location ? (
        <p>
          Lokasi saat ini: Latitude {location.latitude}, Longitude{" "}
          {location.longitude}
        </p>
      ) : (
        <p>Mendapatkan lokasi...</p>
      )}
    </div>
  );
};

export default LocationUpdater;

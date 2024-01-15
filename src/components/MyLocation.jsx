import React, { useEffect, useState } from "react";
import Geolocation from "@react-native-community/geolocation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

const LocationComponent = () => {
  const [location, setLocation] = useState(null);

  const customIcon = new Icon({
    iconUrl: "/img/location-pin.png",
    iconSize: [38, 38],
  });

  useEffect(() => {
    // Mendapatkan lokasi saat komponen dipasang
    getCurrentLocation();

    // Membersihkan langganan ketika komponen dilepas
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error(error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const watchId = Geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
    },
    (error) => {
      console.error(error.message);
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );

  return (
    <>
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
      <div className="maps">
        {location && (
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={13}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[location.latitude, location.longitude]}
              icon={customIcon}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </>
  );
};

export default LocationComponent;

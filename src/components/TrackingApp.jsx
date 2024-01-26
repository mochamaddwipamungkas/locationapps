import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, auth } from "../config/firebase";

import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";

const TrackingApp = () => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);

  const customIcon = new Icon({
    iconUrl: "/img/location-pin.png",
    iconSize: [38, 38],
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    getLocation();
    if (user && location) {
      console.log("ini user", user);
      console.log("ini lokasi", location);
      const id = user.uid;
      set(ref(db, "users/" + id), {
        nama: user.displayName,
        photoURL: user.photoURL,
        kordinat: [location.latitude, location.longitude],
      });
    }
  }, [user, location]);

  useEffect(() => {
    const getData = async () => {
      const userRef = ref(db, "users");
      try {
        const snapshot = await get(userRef);
        console.log("snapshot", snapshot.val());
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  });

  const getLocation = () => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 1000,
        distanceFilter: 10,
      } // Atur interval pembaruan (distanceFilter dalam meter)
    );

    // Bersihkan langganan saat komponen dilepas
    return () => {
      navigator.geolocation.clearWatch(watchId);
      console.log("sebeum", location);
    };
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1>Tracking App</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={() => auth.signOut()}>Sign Out</button>
          {location ? (
            <>
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
              <p>
                Lokasi saat ini: Latitude {location.latitude}, Longitude{" "}
                {location.longitude}
              </p>
            </>
          ) : (
            <p>Mendapatkan lokasi...</p>
          )}
        </div>
      ) : (
        <button onClick={handleGoogleLogin}>Sign In with Google</button>
      )}
    </div>
  );
};

export default TrackingApp;

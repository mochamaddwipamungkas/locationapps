import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, auth } from "../config/firebase";
import "../index.css";

import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { ref, set, get, remove } from "firebase/database";
import "../index.css";

const TrackingApp = () => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [getUser, setGetUser] = useState({});

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
        uid: user.uid,
        nama: user.displayName,
        photoURL: user.photoURL,
        kordinat: [location.latitude, location.longitude],
      });
    }
  }, [location, user]);

  useEffect(() => {
    const getData = async () => {
      const userRef = ref(db, "users");
      try {
        const snapshot = await get(userRef);
        setGetUser(snapshot.val());
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [getUser, user]);

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
        timeout: 20000,
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

  const handleLogout = async () => {
    try {
      await remove(ref(db, `users/${user.uid}`));
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ padding: "20px 30px" }}>
      <h1>Tracking App</h1>
      {user ? (
        <div>
          <p style={{ margin: "10px 0" }}>Welcome, {user.displayName}!</p>
          <button style={{ margin: "10px 0" }} onClick={handleLogout}>
            Sign Out
          </button>
          {location ? (
            <>
              <div style={{ padding: "10px", border: "1px solid #d8d8d8" }}>
                <MapContainer
                  center={[location.latitude, location.longitude]}
                  zoom={13}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {getUser ? (
                    <>
                      {Object.keys(getUser).map((key) => {
                        return (
                          <div
                            style={{ padding: "20px", border: "1px solid red" }}
                          >
                            <Marker
                              key={key}
                              position={[
                                getUser[key].kordinat[0],
                                getUser[key].kordinat[1],
                              ]}
                              icon={
                                new Icon({
                                  className: "img_User",
                                  iconUrl: `${getUser[key].photoURL}`,
                                  iconSize: [25, 25],
                                })
                              }
                            >
                              <Popup>{getUser[key].nama}</Popup>
                            </Marker>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <Marker
                      position={[location.latitude, location.longitude]}
                      icon={
                        new Icon({
                          className: "img_User",
                          iconUrl: `${user.photoURL}`,
                          iconSize: [38, 38],
                        })
                      }
                    >
                      <Popup>{user.displayName}</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              <p>
                Lokasi saat ini: Latitude {location.latitude}, Longitude{" "}
                {location.longitude}
              </p>

              <h2
                style={{
                  marginTop: "10px",
                }}
              >
                Online
              </h2>

              <div>
                {getUser && (
                  <ul style={{ content: "2022", marginRight: "0.5em" }}>
                    {Object.keys(getUser).map((key) => (
                      <li
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        <span
                          style={{
                            marginRight: "0.2em",
                            fontSize: "2em",
                            color: "#7ff53b",
                          }}
                        >
                          •
                        </span>
                        <img
                          style={{ borderRadius: "50%" }}
                          src={getUser[key].photoURL}
                          alt=""
                          width={40}
                        />
                        <p
                          style={{
                            paddingLeft: "10px",
                            fontSize: "1.2em",
                          }}
                        >
                          {getUser[key].nama}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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

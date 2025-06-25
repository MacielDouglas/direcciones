import { useContext, useEffect, useMemo, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import { ThemeContext } from "../../../context/ThemeContext";
import { useSelector } from "react-redux";
import { selectAllAddresses } from "../../../store/selectors/addressSelectors";
import { selectAllMyCard } from "../../../store/selectors/myCardSelectos";
import "mapbox-gl/dist/mapbox-gl.css";

const predefinedColors = [
  "#000",
  "#FF5733",
  "#28A745",
  "#FFC107",
  "#6F42C1",
  "#17A2B8",
  "#E91E63",
];

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

interface MapSectionProps {
  userCard: boolean;
  mapId?: string[];
}

const MapSection = ({ userCard, mapId }: MapSectionProps) => {
  const { darkMode = false } = useContext(ThemeContext) || {};
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  const addresses = useSelector(selectAllAddresses);
  const myCards = useSelector(selectAllMyCard);

  const mapboxToken = import.meta.env.VITE_FIREBASE_MAP_BOX;
  const mapboxStyle = darkMode
    ? import.meta.env.VITE_FIREBASE_MAP_BOX_STYLE_DARK
    : import.meta.env.VITE_FIREBASE_MAP_BOX_STYLE;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error("Erro ao obter localização:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  const allPoints = useMemo(() => {
    const points: [number, number][] = [];

    if (userCard) {
      myCards.forEach((card) => {
        card.street.forEach((address) => {
          if (address.gps) {
            const [lat, lng] = address.gps.split(",").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) points.push([lat, lng]);
          }
        });
      });
    } else if (mapId) {
      addresses.forEach((address) => {
        if (mapId.includes(address.id) && address.gps) {
          const [lat, lng] = address.gps.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) points.push([lat, lng]);
        }
      });
    }

    if (userLocation) points.push(userLocation);
    return points;
  }, [userCard, myCards, addresses, mapId, userLocation]);

  const viewport = useMemo(() => {
    if (allPoints.length === 0)
      return { latitude: -15.7801, longitude: -47.9292, zoom: 4 };

    const lat =
      allPoints.reduce((sum, [lat]) => sum + lat, 0) / allPoints.length;
    const lng =
      allPoints.reduce((sum, [, lng]) => sum + lng, 0) / allPoints.length;

    return {
      latitude: lat,
      longitude: lng,
      zoom: allPoints.length === 1 ? 16 : 13,
    };
  }, [allPoints]);

  return (
    <div className="rounded-xl overflow-hidden max-w-2xl mx-auto">
      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={viewport}
        style={{ width: "100%", height: 300 }}
        mapStyle={mapboxStyle}
      >
        {userLocation && (
          <Marker
            latitude={userLocation[0]}
            longitude={userLocation[1]}
            color="blue"
            anchor="bottom"
          />
        )}

        {userCard
          ? myCards.map((card, idx) =>
              card.street.map((address) => {
                if (!address.gps) return null;
                const [lat, lng] = address.gps.split(",").map(Number);
                if (isNaN(lat) || isNaN(lng)) return null;

                return (
                  <Marker
                    key={`${card.id}-${address.id}`}
                    latitude={lat}
                    longitude={lng}
                    color={predefinedColors[idx % predefinedColors.length]}
                    anchor="bottom"
                  />
                );
              })
            )
          : mapId?.map((id) => {
              const address = addresses.find((a) => a.id === id);
              if (!address || !address.gps) return null;
              const [lat, lng] = address.gps.split(",").map(Number);
              if (isNaN(lat) || isNaN(lng)) return null;

              return (
                <Marker
                  key={address.id}
                  latitude={lat}
                  longitude={lng}
                  color={getRandomColor()}
                  anchor="bottom"
                />
              );
            })}
      </Map>
    </div>
  );
};

export default MapSection;

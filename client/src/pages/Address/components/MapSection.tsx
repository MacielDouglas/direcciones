import { useContext, useEffect, useMemo, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import { ThemeContext } from "../../../context/ThemeContext";
import { useSelector } from "react-redux";
import { selectAllAddresses } from "../../../store/selectors/addressSelectors";
import { selectAllMyCard } from "../../../store/selectors/myCardSelectos";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Pin } from "lucide-react";

interface MapSectionProps {
  showUserCards?: boolean;
  singleAddressId?: string;
  multipleAddressIds?: { id: string; color?: string }[];
  selectedIds?: string[];
  onSelectAddress?: (id: string) => void;
}

const MapSection = ({
  showUserCards = false,
  singleAddressId,
  multipleAddressIds,
  selectedIds = [],
  onSelectAddress,
}: MapSectionProps) => {
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

  const addressMarkers = useMemo(() => {
    const markers: { id: string; lat: number; lng: number; color: string }[] =
      [];

    // 1. Pins dos myCards, com cor por card
    if (showUserCards) {
      const cardColors = [
        "#007BFF",
        "#FF5733",
        "#28A745",
        "#FFC107",
        "#6F42C1",
      ]; // Exemplo de cores diferentes
      myCards.forEach((card, index) => {
        const color = cardColors[index % cardColors.length];
        card.street.forEach((address) => {
          if (address.gps) {
            const [lat, lng] = address.gps.split(",").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
              markers.push({ id: address.id, lat, lng, color });
            }
          }
        });
      });
    }

    // 2. Pin único por singleAddressId
    if (singleAddressId) {
      const address = addresses.find((addr) => addr.id === singleAddressId);
      if (address?.gps) {
        const [lat, lng] = address.gps.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          markers.push({ id: address.id, lat, lng, color: "#FF0000" });
        }
      }
    }

    // 3. multipleAddressIds e selectedIds (prioridade para selectedIds)
    if (multipleAddressIds) {
      multipleAddressIds.forEach(({ id, color = "#FFA500" }) => {
        const address = addresses.find((addr) => addr.id === id);
        if (address?.gps) {
          const [lat, lng] = address.gps.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            const isSelected = selectedIds.includes(id);
            markers.push({
              id: address.id,
              lat,
              lng,
              color: isSelected ? "#000" : color,
            });
          }
        }
      });
    }

    // 4. Localização do usuário
    if (userLocation) {
      markers.push({
        id: "user-location",
        lat: userLocation[0],
        lng: userLocation[1],
        color: "blue",
      });
    }

    return markers;
  }, [
    showUserCards,
    myCards,
    singleAddressId,
    multipleAddressIds,
    selectedIds,
    addresses,
    userLocation,
  ]);

  const viewport = useMemo(() => {
    if (addressMarkers.length === 0)
      return { latitude: -15.7801, longitude: -47.9292, zoom: 4 };

    const avgLat =
      addressMarkers.reduce((sum, marker) => sum + marker.lat, 0) /
      addressMarkers.length;
    const avgLng =
      addressMarkers.reduce((sum, marker) => sum + marker.lng, 0) /
      addressMarkers.length;

    return {
      latitude: avgLat,
      longitude: avgLng,
      zoom: addressMarkers.length === 1 ? 16 : 13,
    };
  }, [addressMarkers]);

  const isSelectable =
    multipleAddressIds && multipleAddressIds.length > 0 && onSelectAddress;

  return (
    <div className="rounded-xl overflow-hidden max-w-2xl mx-auto">
      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={viewport}
        style={{ width: "100%", height: 300 }}
        mapStyle={mapboxStyle}
      >
        {addressMarkers.map((marker) =>
          marker.id === "user-location" ? (
            <Marker
              key={marker.id}
              latitude={marker.lat}
              longitude={marker.lng}
              anchor="bottom"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={32}
                height={32}
                viewBox="0 0 24 24"
              >
                <path
                  fill="#0000ff"
                  d="M17.084 15.812a7 7 0 1 0-10.168 0A6 6 0 0 1 12 13a6 6 0 0 1 5.084 2.812m-8.699 1.473L12 20.899l3.615-3.614a4 4 0 0 0-7.23 0M12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0zM12 10a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 2a3 3 0 1 1 0-6a3 3 0 0 1 0 6"
                />
              </svg>
            </Marker>
          ) : (
            <Marker
              key={marker.id}
              latitude={marker.lat}
              longitude={marker.lng}
              color={marker.color}
              anchor="bottom"
              onClick={() => isSelectable && onSelectAddress?.(marker.id)}
            >
              {marker.color === "#000" ? (
                <Pin size={32} color={marker.color} />
              ) : (
                <MapPin size={32} color={marker.color} />
              )}
            </Marker>
          )
        )}
      </Map>
    </div>
  );
};

export default MapSection;

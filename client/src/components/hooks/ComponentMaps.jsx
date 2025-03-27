import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useCallback, useEffect, useMemo, useState, memo } from "react";
import PropTypes from "prop-types";

const ChangeView = memo(({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14, { animate: true });
  }, [center, map]);
  return null;
});

ChangeView.displayName = "ChangeView";

ChangeView.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const ICONS = {
  red: new L.Icon({
    iconUrl: "pinMapRed.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  blue: new L.Icon({
    iconUrl: "pinMap.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  green: new L.Icon({
    iconUrl: "pinMapGreen.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};

function ComponentMaps({
  cards,
  addresses,
  mode,
  selectedAddresses,
  setSelectedAddresses,
  handleSelectCard,
  cardColors,
}) {
  const [mapCenter, setMapCenter] = useState([0, 0]);

  const displayedAddresses = useMemo(
    () => (mode === "addresses" ? addresses : []),
    [mode, addresses]
  );
  const displayedCards = useMemo(
    () => (mode === "cards" ? cards : []),
    [mode, cards]
  );

  useEffect(() => {
    if (displayedAddresses.length > 0) {
      const [lat, lng] = displayedAddresses[0].gps.split(", ").map(Number);
      setMapCenter([lat, lng]);
    } else if (displayedCards.length > 0) {
      const gpsCoordinates = displayedCards.flatMap((card) =>
        card.street.map((addr) => addr.gps.split(", ").map(Number))
      );
      if (gpsCoordinates.length > 0) {
        const avgLat =
          gpsCoordinates.reduce((sum, [lat]) => sum + lat, 0) /
          gpsCoordinates.length;
        const avgLng =
          gpsCoordinates.reduce((sum, [, lng]) => sum + lng, 0) /
          gpsCoordinates.length;
        setMapCenter([avgLat, avgLng]);
      }
    }
  }, [displayedAddresses, displayedCards]);

  const getIcon = useCallback(
    (id) => (selectedAddresses.includes(id) ? ICONS.green : ICONS.blue),
    [selectedAddresses]
  );

  const toggleSelectAddress = useCallback(
    (id) => {
      setSelectedAddresses((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    },
    [setSelectedAddresses]
  );

  const getCustomIcon = useCallback(
    (cardId, number) =>
      new L.DivIcon({
        className: "custom-marker",
        html: `<div style="position: relative; text-align: center;">
          <svg fill="${
            cardColors[cardId] || "#ef4444"
          }" width="25px" height="42px" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
          </svg>
          <span style="position: absolute; top: 10%; transform: translateY(-50%); font-size: 20px; font-weight: bold; color: black;">${number}</span>
        </div>`,
      }),
    [cardColors]
  );

  return (
    <MapContainer center={mapCenter} zoom={14} className="h-64 w-full z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {displayedAddresses.map(({ id, gps, street, number, city, photo }) => {
        const [lat, lng] = gps.split(", ").map(Number);
        return (
          <Marker
            key={id}
            position={[lat, lng]}
            icon={getIcon(id)}
            eventHandlers={{ click: () => toggleSelectAddress(id) }}
          >
            <Popup>
              <div className="text-sm">
                <img
                  src={photo}
                  className="object-cover w-36"
                  alt={`${street}, ${number}`}
                />
                <p>
                  <strong>{street}</strong>, {number}
                </p>
                <p>{city}</p>
                <p className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      selectedAddresses.includes(id)
                        ? "bg-green-600"
                        : "bg-blue-600"
                    } text-white`}
                  >
                    {selectedAddresses.includes(id)
                      ? "Selecionado"
                      : "Disponível"}
                  </span>
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
      {displayedCards.flatMap((card) =>
        card.street.map(({ id, gps, street, number }) => {
          const [lat, lng] = gps.split(", ").map(Number);
          return (
            <Marker
              key={`${card.id}-${id}`}
              position={[lat, lng]}
              icon={getCustomIcon(card.id, card.number)}
              eventHandlers={{
                click: () =>
                  handleSelectCard(card.id, card.number, card.startDate),
              }}
            >
              <Popup>
                <p>
                  Tarjeta:{" "}
                  <span style={{ color: cardColors[card.id] }}>
                    {card.number}
                  </span>
                </p>
                <p>
                  Direção:{" "}
                  <strong>
                    {street}, {number}
                  </strong>
                </p>
              </Popup>
            </Marker>
          );
        })
      )}
      <ChangeView center={mapCenter} />
    </MapContainer>
  );
}

export default ComponentMaps;

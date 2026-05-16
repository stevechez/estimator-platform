"use client";

import React, { useRef, useEffect } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Search } from "lucide-react";

const libraries: ("places")[] = ["places"];

interface AddressSearchProps {
  onAddressSelect: (lat: number, lng: number, address: string) => void;
}

export default function AddressSearch({ onAddressSelect }: AddressSearchProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
    // Restrict to US for better accuracy (optional)
    autocomplete.setComponentRestrictions({ country: "us" });
    autocomplete.setFields(["geometry", "formatted_address"]);
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      const address = place.formatted_address;

      if (lat && lng && address) {
        onAddressSelect(lat, lng, address);
      }
    }
  };

  if (!isLoaded) return <div className="h-12 w-full animate-pulse bg-slate-100 rounded-lg" />;

  return (
    <div className="relative w-full group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
        <Search className="w-5 h-5" />
      </div>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Enter your home address..."
          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-lg shadow-sm"
        />
      </Autocomplete>
    </div>
  );
}

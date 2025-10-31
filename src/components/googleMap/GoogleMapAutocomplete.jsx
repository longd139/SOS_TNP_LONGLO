import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function GoogleMapAutocomplete({ value, onChange, error }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (!window.google || !window.google.maps || !window.google.maps.places) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ["geocode"],
            componentRestrictions: { country: "vn" },
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place?.geometry) {
                const { lat, lng } = place.geometry.location;
                const mapLink = `https://www.google.com/maps?q=${lat()},${lng()}`;
                onChange(mapLink, place.formatted_address);
            }
        });
    }, []);

    return (
        <div className="md:col-span-2">
            <input
                ref={inputRef}
                type="text"
                placeholder="Nhập địa chỉ hoặc tên địa điểm..."
                className={`w-full px-3 py-2 border rounded-lg ${error ? "border-red-500" : "border-gray-300"
                    }`}
                defaultValue={value}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

GoogleMapAutocomplete.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};

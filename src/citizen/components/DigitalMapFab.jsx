import React from 'react';
import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';

export default function DigitalMapFab() {
  return (
    <Link
      to="/cong-dong/ban-do-so"
      className="map-fab"
      title="Bản đồ số"
      aria-label="Mở bản đồ số"
    >
      <Map size={22} />
    </Link>
  );
}

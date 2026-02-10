/**
 * Star Wars Shadow - Point of Interest Data
 * Defines types, colors, icons, and labels for map markers.
 */

export const POI_TYPES = {
    DUNGEON: {
        count: 12,
        color: '#ef4444',
        label: 'Dungeon Sector',
        icon: "M12 2c-4.4 0-8 3.6-8 8 0 2.2 1.6 4.6 3.4 5.9.4.3.6.8.6 1.3v1.8c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-1.8c0-.5.2-1 .6-1.3C18.4 14.6 20 12.2 20 10c0-4.4-3.6-8-8-8zm0 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
    },
    AUCTION: {
        count: 1,
        color: '#fbbf24',
        label: 'Galactic Auction',
        icon: "M14 12l-2 2-2-2 2-2 2 2zm-2-6l2.12 2.12 2.5-2.5L12 1.05 7.38 5.62l2.5 2.5L12 6zM6 19v2h12v-2H6z"
    },
    SHOP: {
        count: 5,
        color: '#10b981',
        label: 'Merchant Outpost',
        icon: "M16 6V4a4 4 0 0 0-8 0v2H4v14h16V6h-4zm-6-2a2 2 0 0 1 4 0v2h-4V4zm9 14H5V8h14v10z"
    },
    HOSPITAL: {
        count: 2,
        color: '#ffffff',
        label: 'Med Center',
        icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"
    },
    PRISON: {
        count: 3,
        color: '#64748b',
        label: 'Detention Block',
        icon: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-9-2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
    },
    OPERATION: {
        count: 5,
        color: '#991b1b',
        label: 'Operation Raid',
        icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-4h8v-2H8v2zm0-4h8V8H8v2z"
    },
    RACING: {
        count: 1,
        color: '#8b5cf6',
        label: 'Pod Racing Track',
        icon: "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"
    },
    HANGAR: {
        count: 2,
        color: '#3b82f6',
        label: 'Refuge Hangar',
        icon: "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
    }
};

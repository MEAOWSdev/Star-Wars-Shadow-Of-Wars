// Imports from Assets
import sithIcon from '../../assets/sith.svg';
import jediIcon from '../../assets/jedi.svg';
import eternalIcon from '../../assets/eternalempire.svg';
import { SHIP_ICONS } from "./icons.js"; // Keep ship icons as they are for now or use placeholders

// Mock Track Data
export const trackInfo = {
    name: "BOONTA EVE CLASSIC",
    location: "MOS ESPA, TATOOINE",
    distance: "128.4 KM",
    laps: 3,
    weather: "SANDSTORM WARNING",
    temp: "42°C",
    type: "DESERT CANYON",
    difficulty: "EXTREME",
    background: "/tracks/boonta.jpg",
};

// Mock Players
export const mockPlayers = [
    {
        id: "p1",
        name: "SEBULBA_X",
        level: 42,
        faction: "SITH",
        factionIcon: sithIcon,
        shipIcon: SHIP_ICONS.POD_HEAVY,
        ready: true,
        stats: { win: 85, loss: 12 },
    },
    {
        id: "p2",
        name: "SKYWALKER_JR",
        level: 15,
        faction: "JEDI",
        factionIcon: jediIcon,
        shipIcon: SHIP_ICONS.POD_FAST,
        ready: true,
        stats: { win: 5, loss: 2 },
    },
    {
        id: "p3",
        name: "ZAKUUL_PRINCE",
        level: 99,
        faction: "ETERNAL",
        factionIcon: eternalIcon,
        shipIcon: SHIP_ICONS.POD_STD,
        ready: false,
        stats: { win: 120, loss: 0 },
    },
    {
        id: "p4",
        name: "BOUNTY_4U",
        level: 28,
        faction: "SITH",
        factionIcon: sithIcon,
        shipIcon: SHIP_ICONS.POD_HEAVY,
        ready: true,
        stats: { win: 33, loss: 40 },
    },
    {
        id: "p5",
        name: "UNKNOWN_PILOT",
        level: 7,
        faction: "JEDI",
        factionIcon: jediIcon,
        shipIcon: SHIP_ICONS.POD_STD,
        ready: false,
        stats: { win: 1, loss: 10 },
    },
];

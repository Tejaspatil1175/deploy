// --- CONFIGURATION ---
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

// --- APP CONSTANTS ---
export const APP_NAME = "SafeZone";
export const VERSION = "2.0.0";

// --- STATUS TYPES ---
export const USER_STATUS = {
SAFE: 'safe',
HELP_NEEDED: 'help_needed',
INJURED: 'injured',
TRAPPED: 'trapped',
MISSING: 'missing'
};

// --- DISASTER TYPES ---
export const DISASTER_TYPES = {
EARTHQUAKE: 'Earthquake',
FLOOD: 'Flood',
FIRE: 'Fire',
CYCLONE: 'Cyclone',
LANDSLIDE: 'Landslide',
TSUNAMI: 'Tsunami',
OTHER: 'Other'
};

// --- EMERGENCY CONTACTS ---
export const EMERGENCY_CONTACTS = [
{ name: 'Police', number: '100', icon: '🚓' },
{ name: 'Fire Brigade', number: '101', icon: '🚒' },
{ name: 'Ambulance', number: '108', icon: '🚑' },
{ name: 'Disaster Management', number: '1077', icon: '🆘' },
{ name: 'Women Helpline', number: '1091', icon: '👩' },
{ name: 'Child Helpline', number: '1098', icon: '👶' }
];

// --- SAFETY TIPS ---
export const SAFETY_TIPS = {
EARTHQUAKE: [
'Drop, Cover, and Hold On',
'Stay away from windows and heavy objects',
'If outdoors, move away from buildings',
'After shaking stops, evacuate carefully'
],
FLOOD: [
'Move to higher ground immediately',
'Avoid walking in moving water',
'Stay away from electrical lines',
'Listen to emergency broadcasts'
],
FIRE: [
'Stay low to avoid smoke',
'Feel doors before opening',
'Have an escape plan',
'Call fire services immediately'
],
GENERAL: [
'Keep emergency kit ready',
'Know evacuation routes',
'Stay informed via official channels',
'Help others if safe to do so'
]
};

# Audio Files Directory

Place your custom alert audio files here.

## Supported Formats:
- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)

## File Naming Convention:
- `alert1.mp3` - Primary alert sound (10 seconds)
- `alert2.mp3` - Secondary alert sound (optional)
- `alert3.mp3` - Tertiary alert sound (optional)

## Usage:
The system will automatically load audio files from this directory. Make sure your audio files are:
- 10 seconds long (as specified)
- High quality for clear alerts
- Appropriate volume levels
- Saved in supported formats

## Example:
```
public/audio/
├── alert1.mp3    (Primary alert - 10 seconds)
├── alert2.mp3    (Secondary alert - 10 seconds)
└── alert3.mp3    (Tertiary alert - 10 seconds)
```


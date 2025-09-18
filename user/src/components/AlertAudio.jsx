import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';

const AlertAudio = ({ isPlaying, onToggle, volume, onVolumeChange }) => {
  const [audioContext, setAudioContext] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Web Audio API is supported
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      setIsSupported(true);
      setAudioContext(new AudioContext());
    }
  }, []);

  const playEmergencyAlert = () => {
    if (!audioContext) return;

    try {
      // Create multiple alarm tones
      const frequencies = [800, 1000, 1200]; // Different frequencies for urgency
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'square'; // Sharp, attention-grabbing sound
          
          // Volume envelope for pulsing effect
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.4);
        }, index * 500);
      });
      
    } catch (error) {
      console.error('Error playing emergency alert:', error);
    }
  };

  const playContinuousAlert = () => {
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.type = 'sawtooth';
      
      // Continuous pulsing volume
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.2);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.4);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.6);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.8);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 1.0);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.2);
      
    } catch (error) {
      console.error('Error playing continuous alert:', error);
    }
  };

  const playTestAlert = () => {
    playEmergencyAlert();
  };

  if (!isSupported) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <p className="text-yellow-700 text-sm">
            Audio alerts not supported in this browser. Please use a modern browser for full functionality.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-red-50 border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-red-800 flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Emergency Alert Audio
        </CardTitle>
        <CardDescription className="text-red-600">
          Test and control emergency alert sounds
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Volume Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-red-700">Alert Volume</label>
          <div className="flex items-center space-x-3">
            <VolumeX className="w-4 h-4 text-red-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
            />
            <Volume2 className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700 w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        {/* Alert Controls */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={playTestAlert}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <Volume1 className="w-4 h-4 mr-2" />
            Test Alert
          </Button>
          
          <Button
            onClick={onToggle}
            variant={isPlaying ? "destructive" : "outline"}
            className={isPlaying ? "bg-red-600 hover:bg-red-700" : "border-red-300 text-red-700 hover:bg-red-100"}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                Stop Alert
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Start Alert
              </>
            )}
          </Button>
        </div>

        {/* Alert Types */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-red-700">Alert Types</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={playEmergencyAlert}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Emergency
            </Button>
            <Button
              onClick={playContinuousAlert}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Continuous
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="p-3 bg-red-100 rounded-lg">
          <p className="text-xs text-red-700">
            <strong>Status:</strong> {isPlaying ? 'Alert Active' : 'Alert Ready'}
          </p>
          <p className="text-xs text-red-600 mt-1">
            Audio alerts will play automatically when disasters are detected in your area.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertAudio;


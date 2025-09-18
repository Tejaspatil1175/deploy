import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, AlertTriangle, Clock, StopCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';

const ProgressiveAlert = ({ 
  isActive, 
  onStop, 
  volume, 
  onVolumeChange,
  customAudioFiles = []
}) => {
  const [currentInterval, setCurrentInterval] = useState(10); // Start with 10 seconds
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioFile, setCurrentAudioFile] = useState(0);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const timeRef = useRef(null);

  // Progressive intervals: 30s -> 30s -> 30s -> 30s... (fixed 30-second intervals)
  const getNextInterval = (current) => {
    return 30; // Always 30 seconds
  };

  // Play custom audio file
  const playCustomAudio = () => {
    if (customAudioFiles.length === 0) {
      // No fallback - just log and return
      console.log('No custom audio files available');
      return;
    }

    try {
      const audioFile = customAudioFiles[currentAudioFile % customAudioFiles.length];
      const audio = new Audio(audioFile);
      audio.volume = volume;
      
      audio.onplay = () => {
        console.log('Custom audio started playing');
        setIsPlaying(true);
      };
      audio.onended = () => {
        console.log('Custom audio ended');
        setIsPlaying(false);
      };
      audio.onerror = (e) => {
        console.log('Custom audio failed:', e);
        setIsPlaying(false);
      };
      
      audio.play().then(() => {
        console.log('Audio play promise resolved');
        
        // Stop audio after 10 seconds regardless of file length
        setTimeout(() => {
          if (audio && !audio.paused) {
            console.log('Stopping audio after 10 seconds');
            audio.pause();
            audio.currentTime = 0;
            setIsPlaying(false);
          }
        }, 10000); // 10 seconds
        
      }).catch((error) => {
        console.log('Custom audio play failed:', error);
        setIsPlaying(false);
      });
      
      audioRef.current = audio;
    } catch (error) {
      console.log('Error playing custom audio:', error);
      setIsPlaying(false);
    }
  };

  // Play default alert sound
  const playDefaultAlert = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800 + (alertCount * 200), audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 500);
    } catch (error) {
      console.log('Error playing default alert:', error);
    }
  };

  // Start the progressive alert system
  const startProgressiveAlert = () => {
    if (intervalRef.current) return; // Already running
    
    setAlertCount(0);
    setCurrentInterval(30);
    setTimeRemaining(30);
    
    // DON'T play first alert immediately - wait for the interval
    console.log('Progressive alert system started - waiting for first interval (30 seconds)');
    
    // Set up interval for alerts (starts after 30 seconds)
    intervalRef.current = setInterval(() => {
      playCustomAudio();
      setAlertCount(prev => prev + 1);
      
      // Update to next interval (always 30 seconds)
      setCurrentInterval(30);
      setTimeRemaining(30);
      
    }, 30000); // 30 seconds
  };

  // Stop the progressive alert system
  const stopProgressiveAlert = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    setIsPlaying(false);
    setTimeRemaining(0);
    setAlertCount(0);
    setCurrentInterval(10);
    
    if (onStop) onStop();
  };

  // Countdown timer
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timeRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            return currentInterval;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isActive, timeRemaining, currentInterval]);

  // Auto-start when active
  useEffect(() => {
    if (isActive) {
      startProgressiveAlert();
    } else {
      stopProgressiveAlert();
    }
    
    return () => {
      stopProgressiveAlert();
    };
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressiveAlert();
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`${isActive ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`${isActive ? 'text-red-800' : 'text-gray-700'} flex items-center gap-2`}>
          <AlertTriangle className="w-5 h-5" />
          Progressive Alert System
        </CardTitle>
        <CardDescription className={isActive ? 'text-red-600' : 'text-gray-500'}>
          {isActive ? 'Alert system is active' : 'Alert system is ready'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? 'destructive' : 'secondary'}>
              {isActive ? 'ACTIVE' : 'READY'}
            </Badge>
            {isPlaying && (
              <Badge variant="outline" className="animate-pulse">
                <Volume2 className="w-3 h-3 mr-1" />
                PLAYING
              </Badge>
            )}
          </div>
          
          {isActive && (
            <div className="text-sm text-red-700">
              Alert #{alertCount}
            </div>
          )}
        </div>

        {/* Countdown Timer */}
        {isActive && (
          <div className="text-center p-4 bg-red-100 rounded-lg">
            <div className="text-2xl font-bold text-red-800">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-red-600">
              Next alert in
            </div>
            <div className="text-xs text-red-500 mt-1">
              Current interval: {currentInterval}s
            </div>
          </div>
        )}

        {/* Volume Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Alert Volume</label>
          <div className="flex items-center space-x-3">
            <VolumeX className="w-4 h-4 text-gray-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <Volume2 className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700 w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        {/* Audio File Info */}
        {customAudioFiles.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800">
              Custom Audio Files: {customAudioFiles.length}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Currently using: {customAudioFiles[currentAudioFile % customAudioFiles.length]?.split('/').pop() || 'Default'}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={playCustomAudio}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
            disabled={isActive}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Test Alert
          </Button>
          
          <Button
            onClick={isActive ? stopProgressiveAlert : startProgressiveAlert}
            variant={isActive ? "destructive" : "default"}
            className={isActive ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {isActive ? (
              <>
                <StopCircle className="w-4 h-4 mr-2" />
                Stop Alert
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Start Alert
              </>
            )}
          </Button>
        </div>

        {/* Progress Info */}
        {isActive && (
          <div className="text-xs text-gray-600 space-y-1">
            <div>• First alert: 30 seconds (from start)</div>
            <div>• Second alert: 60 seconds (from start)</div>
            <div>• Third alert: 90 seconds (from start)</div>
            <div>• Fourth alert: 120 seconds (from start)</div>
            <div>• Every 30 seconds after that</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressiveAlert;


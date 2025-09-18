import React, { useState } from 'react';
import { Upload, Music, FileAudio, Trash2, Play, Pause } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';

const AudioFileManager = ({ customAudioFiles, onFilesUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const audioFiles = files.filter(file => 
      file.type.startsWith('audio/') && 
      (file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.ogg'))
    );

    if (audioFiles.length > 0) {
      // Create object URLs for the uploaded files
      const fileUrls = audioFiles.map(file => URL.createObjectURL(file));
      onFilesUpdate([...customAudioFiles, ...fileUrls]);
    }
  };

  const removeFile = (index) => {
    const newFiles = customAudioFiles.filter((_, i) => i !== index);
    onFilesUpdate(newFiles);
  };

  const playFile = (index) => {
    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(customAudioFiles[index]);
    audio.onplay = () => setIsPlaying(index);
    audio.onended = () => setIsPlaying(null);
    audio.onerror = () => {
      console.log('Error playing audio file');
      setIsPlaying(null);
    };

    audio.play().catch(() => {
      console.log('Could not play audio file');
      setIsPlaying(null);
    });

    setAudioElement(audio);
  };

  const stopPlaying = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    setIsPlaying(null);
    setAudioElement(null);
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <Music className="w-5 h-5" />
          Custom Audio Files
        </CardTitle>
        <CardDescription className="text-blue-600">
          Upload and manage your custom alert sounds
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-700">Upload Audio Files</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="audio/mp3,audio/wav,audio/ogg"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              Choose Files
            </label>
            <span className="text-xs text-blue-600">
              Supports MP3, WAV, OGG (10 seconds recommended)
            </span>
          </div>
        </div>

        {/* File List */}
        {customAudioFiles.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-700">Uploaded Files</label>
            <div className="space-y-2">
              {customAudioFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
                >
                  <div className="flex items-center gap-3">
                    <FileAudio className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-blue-800">
                        Audio File {index + 1}
                      </div>
                      <div className="text-xs text-blue-600">
                        {file.includes('blob:') ? 'Uploaded file' : file.split('/').pop()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isPlaying === index ? (
                      <Button
                        onClick={stopPlaying}
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        <Pause className="w-3 h-3" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => playFile(index)}
                        size="sm"
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => removeFile(index)}
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="p-3 bg-blue-100 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-2">Instructions:</div>
          <div className="text-xs text-blue-700 space-y-1">
            <div>• Upload audio files in MP3, WAV, or OGG format</div>
            <div>• Recommended length: 10 seconds</div>
            <div>• Files will be used in sequence for progressive alerts</div>
            <div>• First file plays at 10s, second at 30s, third at 50s, etc.</div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-blue-300 text-blue-700">
            {customAudioFiles.length} file(s) loaded
          </Badge>
          
          {isPlaying !== null && (
            <Badge variant="outline" className="border-green-300 text-green-700 animate-pulse">
              <Play className="w-3 h-3 mr-1" />
              Playing File {isPlaying + 1}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioFileManager;


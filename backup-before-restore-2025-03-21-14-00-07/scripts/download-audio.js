const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const videos = [
  {
    id: 'hFdMHvB6-Jk',
    output: 'warmup-1.mp3'
  },
  {
    id: 'ZvWZr6TNh9Y',
    output: 'warmup-2.mp3'
  },
  {
    id: 'r58-5DBfMpY',
    output: 'range.mp3'
  },
  {
    id: '0zARqh3xwnw',
    output: 'breathing.mp3'
  },
  {
    id: 'AWsarzdZ1u8',
    output: 'control.mp3'
  },
  {
    id: 'GidIMbCmtyk',
    output: 'pitch.mp3'
  },
  {
    id: 'QgZKO_f5FlM',
    output: 'pro.mp3'
  }
];

const audioDir = path.join(__dirname, '../public/audio');

// Create the directory if it doesn't exist
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Function to download a single video's audio
function downloadAudio(video) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(audioDir, video.output);
    const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" https://www.youtube.com/watch?v=${video.id}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error downloading ${video.output}:`, error);
        reject(error);
      } else {
        console.log(`Successfully downloaded ${video.output}`);
        resolve();
      }
    });
  });
}

// Download all videos sequentially
async function downloadAllAudio() {
  for (const video of videos) {
    try {
      await downloadAudio(video);
    } catch (error) {
      console.error(`Failed to download ${video.output}`);
    }
  }
}

// Start the download process
downloadAllAudio(); 
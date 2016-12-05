'use strict';
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const AWS = require('aws-sdk');
const settings = require('../../settings');

const DEFAULT_SETTINGS = {
  OutputFormat: 'mp3',
  VoiceId: 'Joanna',
  TextType: 'text'
};

function polly(phrase, language) {
  if (!settings.aws) {
    return Promise.resolve();
    
  }

  // Construct a filesystem neutral filename
  const dynamicParameters = { Text: phrase };
  if (settings.aws.name) {
    dynamicParameters.VoiceId = settings.aws.name;
  }
  const synthesizeParameters = Object.assign({}, DEFAULT_SETTINGS, dynamicParameters);
  const phraseHash = crypto.createHash('sha1').update(phrase).digest('hex');
  const filename = `polly-${phraseHash}-${synthesizeParameters.VoiceId}.mp3`;
  const filepath = path.resolve(settings.webroot, 'tts', filename);
  
  const expectedUri = `/tts/${filename}`;
  try {
    fs.accessSync(filepath, fs.R_OK);
    return Promise.resolve(expectedUri);
  } catch (err) {
    console.log(`announce file for phrase "${phrase}" does not seem to exist, downloading`);
  }

  const constructorParameters = Object.assign({ apiVersion: '2016-06-10' }, settings.aws.credentials);

  const polly = new AWS.Polly(constructorParameters);

  return polly.synthesizeSpeech(synthesizeParameters)
    .promise()
    .then((data) => {
      fs.writeFileSync(filepath, data.AudioStream);
      return expectedUri;
    });
}

module.exports = polly;
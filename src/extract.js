const fs = require('fs');

fs.readFile('Testsail.sbp', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const lines = data.split('\n');
  
  const direction = lines.map(line => {
    const values = line.split('\t').map(parseFloat);
    return {
      X_Position: values[1],
      Y_Position: values[2],
    };
  });

  const timeData = lines.map(line => {
    const values = line.split('\t').map(parseFloat);
    return {
      time: values[0] / 60.0,
    };
  });

  const fwdVelocityData = lines.map(line => {
    const values = line.split('\t').map(parseFloat);
    return {
      fwd_velocity: values[6] / -0.3631,
    };
  });

  const hikingEffectData = lines.map(line => {
    const values = line.split('\t').map(parseFloat);
    return {
      hiking_effect: values[14],
    };
  });

  // Write data to separate JSON files
  fs.writeFile('data/direction.json', JSON.stringify(direction, null, 2), 'utf8', err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('sbpData has been written to sbpData.json');
  });

  fs.writeFile('data/timeData.json', JSON.stringify(timeData, null, 2), 'utf8', err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('timeData has been written to timeData.json');
  });

  fs.writeFile('data/fwdVelocityData.json', JSON.stringify(fwdVelocityData, null, 2), 'utf8', err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('fwdVelocityData has been written to fwdVelocityData.json');
  });

  fs.writeFile('data/hikingEffectData.json', JSON.stringify(hikingEffectData, null, 2), 'utf8', err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('hikingEffectData has been written to hikingEffectData.json');
  });
});

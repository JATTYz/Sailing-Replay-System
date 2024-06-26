import { readFile, writeFile } from "fs";

readFile("Testsail.sbp", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // console.log(data);

  const lines = data.split("\n");

  const direction = lines.map((line) => {
    const values = line.split("\t").map(parseFloat);
    return {
      X_Position: values[1],
      Y_Position: values[2],
    };
  });

  const timeData = lines.map((line) => {
    const values = line.split("\t").map(parseFloat);
    return {
      time: values[0] / 60.0,
    };
  });

  const fwdVelocityData = lines.map((line) => {
    const values = line.split("\t").map(parseFloat);
    return {
      fwd_velocity: values[6] / -0.3631,
    };
  });

  const hikingEffectData = lines.map((line) => {
    const values = line.split("\t").map(parseFloat);
    return {
      hiking_effect: values[14],
    };
  });

  const timeAndXYData = lines.map((line) => {
    const values = line.split("\t").map(parseFloat);
    return {
      time: values[0] / 60.0,
      X_Position: values[1],
      Y_Position: values[2],
      // heading: (values[6] * 180) / Math.PI,
      headingRadians: ((values[6] * 180) / Math.PI) * (Math.PI / 180), //Get radians, but degrees
    };
  });

  // Write data to separate JSON files
  writeFile(
    "data/direction.json",
    JSON.stringify(direction, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("sbpData has been written to sbpData.json");
    }
  );

  writeFile(
    "data/timeData.json",
    JSON.stringify(timeData, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("timeData has been written to timeData.json");
    }
  );

  writeFile(
    "data/fwdVelocityData.json",
    JSON.stringify(fwdVelocityData, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("fwdVelocityData has been written to fwdVelocityData.json");
    }
  );

  writeFile(
    "data/hikingEffectData.json",
    JSON.stringify(hikingEffectData, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("hikingEffectData has been written to hikingEffectData.json");
    }
  );

  writeFile(
    "data/timeAndXY.json",
    JSON.stringify(timeAndXYData, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("timeAndXYData has been written to timeAndXY.json");
    }
  );
});

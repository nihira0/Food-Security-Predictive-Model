const systemUI = new SmartFarmSystem();
let currentFarmer = null;

function addFarmerUI() {
  const name = document.getElementById('farmerName').value;
  const location = document.getElementById('farmerLocation').value;

  if (!name || !location) {
    alert('Enter valid farmer details');
    return;
  }

  currentFarmer = systemUI.addFarmer(name, location);
  alert('Farmer added successfully');
}

function addCropUI() {
  if (!currentFarmer) {
    alert('Add farmer first');
    return;
  }

  const name = document.getElementById('cropName').value;
  const area = parseFloat(document.getElementById('cropArea').value);
  const yieldVal = parseFloat(document.getElementById('cropYield').value);

  if (!name || area <= 0 || yieldVal <= 0) {
    alert('Invalid crop data');
    return;
  }

  const crop = new Crop(name, area, yieldVal);
  crop.updateYield(Math.floor(Math.random() * yieldVal));

  systemUI.addCropToFarmer(currentFarmer.id, crop);
  alert('Crop added successfully');
}

function showReport() {
  let output = '';

  systemUI.farmers.forEach(f => {
    output += `Farmer: ${f.name}\n`;
    f.crops.forEach(c => {
      output += `  Crop: ${c.name}, Yield: ${c.actualYield}\n`;
    });
  });

  document.getElementById('output').innerText = output;
}
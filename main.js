// ================== UTILITY CLASS ==================
class Utils {
  static generateId(prefix) {
    return prefix + '_' + Math.random().toString(36).substr(2, 9);
  }

  static formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
  }
}

// ================== FARMER ==================
class Farmer {
  constructor(name, location) {
    this.id = Utils.generateId('F');
    this.name = name;
    this.location = location;
    this.crops = [];
  }

  addCrop(crop) {
    this.crops.push(crop);
  }
}

// ================== CROP ==================
class Crop {
  constructor(name, area, expectedYield) {
    if (area <= 0 || expectedYield <= 0) {
      throw new Error('Invalid crop data');
    }

    this.id = Utils.generateId('C');
    this.name = name;
    this.area = area;
    this.expectedYield = expectedYield;
    this.actualYield = 0;
  }

  updateYield(yieldAmount) {
    if (yieldAmount < 0) throw new Error('Invalid yield');
    this.actualYield = yieldAmount;
  }

  calculateEfficiency() {
    return (this.actualYield / this.expectedYield) * 100;
  }
}

// ================== ACTIVITY (BASE CLASS) ==================
class Activity {
  constructor(type, cost) {
    this.id = Utils.generateId('A');
    this.type = type;
    this.date = Utils.formatDate(new Date());
    this.cost = cost;
  }

  getDetails() {
    return `${this.type} - ₹${this.cost}`;
  }
}

// ================== INHERITANCE ==================
class Irrigation extends Activity {
  constructor(cost, waterUsed) {
    super('Irrigation', cost);
    this.waterUsed = waterUsed;
  }

  getDetails() {
    return `Irrigation | Water: ${this.waterUsed}L | Cost: ₹${this.cost}`;
  }
}

class Fertilization extends Activity {
  constructor(cost, fertilizerType) {
    super('Fertilization', cost);
    this.fertilizerType = fertilizerType;
  }

  getDetails() {
    return `Fertilizer: ${this.fertilizerType} | Cost: ₹${this.cost}`;
  }
}

// ================== FOOD STOCK ==================
class FoodStock {
  constructor(cropName, quantity, minLevel) {
    this.cropName = cropName;
    this.quantity = quantity;
    this.minLevel = minLevel;
  }

  isLow() {
    return this.quantity < this.minLevel;
  }
}

// ================== MAIN SYSTEM ==================
class SmartFarmSystem {
  constructor() {
    this.farmers = [];
    this.activities = [];
    this.stock = [];
    this.undoStack = [];
    this.activityQueue = [];
  }

  // -------- FARMER --------
  addFarmer(name, location) {
    const farmer = new Farmer(name, location);
    this.farmers.push(farmer);
    this.undoStack.push({ action: 'addFarmer', farmer });
    return farmer;
  }

  // -------- CROP --------
  addCropToFarmer(farmerId, crop) {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (!farmer) throw new Error('Farmer not found');

    farmer.addCrop(crop);
    this.undoStack.push({ action: 'addCrop', farmer, crop });
  }

  // -------- ACTIVITY (QUEUE) --------
  addActivity(activity) {
    this.activityQueue.push(activity);
  }

  processActivity() {
    if (this.activityQueue.length === 0) return;
    const activity = this.activityQueue.shift();
    this.activities.push(activity);
    console.log('Processed:', activity.getDetails());
  }

  // -------- STOCK --------
  addStock(stock) {
    this.stock.push(stock);
  }

  // -------- ALERTS --------
  checkStockAlerts() {
    this.stock.forEach(item => {
      if (item.isLow()) {
        console.log(`⚠️ Low stock: ${item.cropName}`);
      }
    });
  }

  checkYieldAlerts() {
    this.farmers.forEach(f => {
      f.crops.forEach(c => {
        if (c.calculateEfficiency() < 50) {
          console.log(`⚠️ Low yield for ${c.name}`);
        }
      });
    });
  }

  // -------- SORTING --------
  sortCropsByYield() {
    let allCrops = [];
    this.farmers.forEach(f => allCrops.push(...f.crops));
    return allCrops.sort((a, b) => b.actualYield - a.actualYield);
  }

  sortActivitiesByDate() {
    return this.activities.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  getTopCrops(n = 3) {
    return this.sortCropsByYield().slice(0, n);
  }

  // -------- UNDO (STACK) --------
  undo() {
    const last = this.undoStack.pop();
    if (!last) return;

    if (last.action === 'addFarmer') {
      this.farmers = this.farmers.filter(f => f.id !== last.farmer.id);
      console.log('Undo farmer addition');
    }

    if (last.action === 'addCrop') {
      last.farmer.crops = last.farmer.crops.filter(c => c.id !== last.crop.id);
      console.log('Undo crop addition');
    }
  }

  // -------- REPORT --------
  generateReport() {
    let report = '';

    this.farmers.forEach(f => {
      report += `Farmer: ${f.name}\n`;
      f.crops.forEach(c => {
        report += `  Crop: ${c.name}, Yield: ${c.actualYield}\n`;
      });
    });

    report += `\nTop Crops: ${this.getTopCrops().map(c => c.name).join(', ')}`;

    return report;
  }
}
const fs = require('node:fs');
const path = require('node:path');

class ComponentsManager {
  _components = {};
  static _instance;

  async loadComponentFiles() {
    const componentPath = path.join(__dirname, '..', 'components');
    const componentFiles = fs.readdirSync(componentPath).filter(file => file.endsWith('.js'));

    for (const file of componentFiles) {
      const filePath = path.join(componentPath, file);
      const fileName = file.split('.')[0];

      this._components[fileName] = require(filePath);
    }
  }

  static dispatch(interaction) {
    const { customId } = interaction;

    const component = ComponentsManager.getComponent(customId);
    
    if (!component) return;
    
}

  static getComponent(key) {
    const cm = ComponentsManager.getInstance();
        if (Object.keys(cm._components).includes(key) && Object.keys(cm._components[key]).includes(key)) {
            return cm._components[key][key];
        }
        return null;
  }

  static getInstance() {
    if (!ComponentsManager._instance) {
      ComponentsManager._instance = new ComponentsManager();
    }
    return ComponentsManager._instance;
  }

  constructor() {
    this.loadComponentFiles();
  }
}

module.exports.ComponentsManager = ComponentsManager;

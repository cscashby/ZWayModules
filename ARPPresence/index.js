/*** ARPPresence Z-Way HA module *******************************************

Version: 0.0.1
(c) Christian Ashby, 2016
-----------------------------------------------------------------------------
Author: Christian Ashby
Description:
This module creates a sensorBinary widget based on presence of a given MAC address

 ******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function ARPPresence(id, controller) {
    "use strict";
    // Call superconstructor first (AutomationModule)
    ARPPresence.super_.call(this, id, controller);
}

inherits(ARPPresence, AutomationModule);

_module = ARPPresence;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

ARPPresence.prototype.init = function (config) {
    ARPPresence.super_.prototype.init.call(this, config);

    var self = this;

    this.vDev = self.controller.devices.create({
        deviceId: "ARPPresence_" + this.id,
        defaults: {
            deviceType: "sensorBinary",
            metrics: {
                probeTitle: this.config.probeTitle
            }
        },
        overlay: {
            metrics: {
                scaleTitle: this.config.scaleTitle,
                title: this.config.deviceName
            }
        },
        moduleId: this.id
    });

    this.timer = setInterval(function () {
        self.checkARP(self);
    }, self.config.polling * 60 * 1000);
    self.checkARP(self);
};

ARPPresence.prototype.stop = function () {
    ARPPresence.super_.prototype.stop.call(this);

    if (this.timer)
        clearInterval(this.timer);

    if (this.vDev) {
        this.controller.devices.remove(this.vDev.id);
        this.vDev = null;
    }
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

ARPPresence.prototype.checkARP = function (instance) {
    var self = instance,
        moduleName = "ARPPresence",
        langFile = self.controller.loadModuleLang(moduleName),
        name = self.config.name + "text()",
        macaddress = self.config.macaddress + "text()";
    if (self.config.debug) {
        console.log("Name: ", self.config.name);
        console.log("MAC: ", self.config.macaddress);
        console.log("Debug: ", self.config.debug);
    }  
};

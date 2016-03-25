/*** JSONDevice Z-Way HA module *******************************************

Version: 0.0.1
(c) Christian Ashby, 2016
-----------------------------------------------------------------------------
Author: Christian Ashby's adaptation for JSONDevice API
Derived from XMLDevice module by Serguei Poltorak <ps@z-wave.me>
Description:
This module creates a sensorMultilevel or a sensorBinary widget

 ******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function JSONDevice(id, controller) {
    "use strict";
    // Call superconstructor first (AutomationModule)
    JSONDevice.super_.call(this, id, controller);
}

inherits(JSONDevice, AutomationModule);

_module = JSONDevice;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

JSONDevice.prototype.init = function (config) {
    JSONDevice.super_.prototype.init.call(this, config);

    var self = this;

    this.vDev = self.controller.devices.create({
        deviceId: "JSONDevice_" + this.id,
        defaults: {
            deviceType: "sensorMultilevel",
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
        self.fetchJSONElement(self);
    }, self.config.polling * 60 * 1000);
    self.fetchJSONElement(self);
};

JSONDevice.prototype.stop = function () {
    JSONDevice.super_.prototype.stop.call(this);

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

JSONDevice.prototype.fetchJSONElement = function (instance) {
    var self = instance,
        moduleName = "JSONDevice",
        langFile = self.controller.loadModuleLang(moduleName),
        isNumerical = self.config.isNumerical,
        isFloat = self.config.isFloat,
        jsonPath = self.config.jsonPath + "text()";
    if (self.config.debug) {
        console.log("jsonPath: ", self.config.jsonPath);
        console.log("Url: ", self.config.url);
        console.log("Float: ", isFloat);
        console.log("Numerical: ", isNumerical);
        console.log("Debug: ", self.config.debug);
    }

    http.request({
        url: self.config.url,
        async: true,
        contentType: "text/json",
        success: function (res) {
            try {
                if (self.config.debug) {
                    console.log("data: ", JSON.stringify(res.data));
                }
                var json = res.data;
                if (self.config.debug) {
                    console.log("element: ", eval("json." + self.config.jsonPath));
                }
                if (isNumerical) {
                    deviceType = "sensorMultilevel";
                    if (isFloat) {
                        level = parseFloat(eval("json." + self.config.jsonPath));
                    } else {
                        level = parseInt(eval("json." + self.config.jsonPath));
                    }
                } else {
                    deviceType = "text";
                    level = eval("json." + self.config.jsonPath);
                }
                self.vDev.set("metrics:level", level);
            } catch (e) {
                if (self.config.debug) {
                    self.controller.addNotification("error", langFile.err_parse, "module", moduleName);
                    console.log("jsonPath: ", self.config.jsonPath);
                }
            }
        },
        error: function () {
            if (self.config.debug) {
                self.controller.addNotification("error", langFile.err_fetch, "module", moduleName);
                console.log("URL: ", self.config.url);
            }
        }
    });
};

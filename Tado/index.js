/*** Tado Z-Way HA module *******************************************

Version: 0.0.1
(c) Christian Ashby, 2016
-----------------------------------------------------------------------------
Author: Christian Ashby's device mapping for Tado heating controllers
Derived from JSONDevice which was created from the
XMLDevice module by Serguei Poltorak <ps@z-wave.me>
Description:
This module creates a sensorMultilevel or a sensorBinary widget

 ******************************************************************************/

TADO_STATE_URL="https://my.tado.com/mobile/1.9/getCurrentState"

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function Tado(id, controller) {
    "use strict";
    // Call superconstructor first (AutomationModule)
    Tado.super_.call(this, id, controller);
}

inherits(Tado, AutomationModule);

_module = Tado;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

Tado.prototype.init = function (config) {
    Tado.super_.prototype.init.call(this, config);

    var self = this;

    this.vDev = self.controller.devices.create({
        deviceId: "Tado_" + this.id,
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

Tado.prototype.stop = function () {
    Tado.super_.prototype.stop.call(this);

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

Tado.prototype.fetchJSONElement = function (instance) {
    var self = instance,
        moduleName = "Tado",
        langFile = self.controller.loadModuleLang(moduleName);
    if (self.config.debug) {
        console.log("username: ", self.config.username);
        console.log("password: XXX");
    }

    stateURL = TADO_STATE_URL + "?username=" + self.config.username + "&password=" + self.config.password
    http.request({
        url: stateURL,
        async: true,
        contentType: "text/json",
        timeout: 10000,
        success: function (res) {
            try {
                var json = JSON.parse(res.data);
                if (self.config.debug) {
                    for (i in json) {
                        console.log("key: ", i);
                    }
                }
                //deviceType = "sensorMultilevel";
                //level = parseFloat(eval("json." + self.config.jsonPath));
                //self.vDev.set("metrics:level", level);
            } catch (e) {
                if (self.config.debug) {
                    self.controller.addNotification("error", langFile.err_parse, "module", moduleName);
                }
            }
        },
        error: function () {
            if (self.config.debug) {
                self.controller.addNotification("error", langFile.err_fetch, "module", moduleName);
                console.log("URL: ", stateURL);
            }
        }
    });
};

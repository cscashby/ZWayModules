/*** Tado Z-Way HA module *******************************************

Version: 0.2.3
(c) Christian Ashby, 2016
-----------------------------------------------------------------------------
Author: Christian Ashby's device mapping for Tado heating controllers
Derived from JSONDevice which was created from the
XMLDevice module by Serguei Poltorak <ps@z-wave.me>
Description:
This module creates a number of sensorMultilevel and sensorBinary virtual devices corresponding
to temperature settings of the Tado thermostat device, and for each user's presence

 ******************************************************************************/

TADO_STATE_URL="https://my.tado.com/mobile/1.9/getCurrentState"
TADO_USERS_URL="https://my.tado.com/mobile/1.6/getAppUsersRelativePositions"

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

    this.vDevs = {
        "insideTemp": self.controller.devices.create({
            deviceId: "Tado_InsideTemp" + this.id,
            defaults: {
                deviceType: "sensorMultilevel",
                probeType: "temperature",
                metrics: {
                    probeTitle: "Inside Temp",
                    icon: "temperature",
                    title: "Tado"
                }
            },
            overlay: {
                metrics: {
                    scaleTitle: "C",
                    title: "Inside Temp"
                }
            },
            moduleId: this.id
        }),
        "setPointTemp": self.controller.devices.create({
            deviceId: "Tado_SetPointTemp" + this.id,
            defaults: {
                deviceType: "sensorMultilevel",
                probeType: "temperature",
                metrics: {
                    probeTitle: "Set Point Temp",
                    icon: "temperature",
                    title: "Tado"
                }
            },
            overlay: {
                metrics: {
                    scaleTitle: "C",
                    title: "Set Temp"
                }
            },
            moduleId: this.id
        })
    };

    this.timer = setInterval(function () {
        self.getData(self);
    }, self.config.polling * 60 * 1000);
    self.getData(self);
};

Tado.prototype.stop = function () {
    Tado.super_.prototype.stop.call(this);

    if (this.timer)
        clearInterval(this.timer);

    if (this.vDevs) {
        for (x in this.vDevs) {
            this.controller.devices.remove(this.vDevs[x].id);
        }
        this.vDevs = null;
    }
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

Tado.prototype.createUserDevice = function(instance, user, index) {
    var self = instance,
        moduleName = "Tado",
        langFile = self.controller.loadModuleLang(moduleName);
    return self.controller.devices.create({
        deviceId: "Tado_User" + index,
        defaults: {
            deviceType: "sensorBinary",
            probeType: "general_purpose",
            metrics: {
                probeTitle: user.nickname,
                icon: "door",
                title: "Tado - Presence"
            }
        },
        overlay: {
            metrics: {
                title: user.nickname
            }
        },
        moduleId: this.id
    })
}

Tado.prototype.getData = function (instance) {
    var self = instance,
        moduleName = "Tado",
        langFile = self.controller.loadModuleLang(moduleName);
    if (self.config.debug) {
        console.log("username: ", self.config.username);
        console.log("password: XXX");
    }

    stateURL = TADO_STATE_URL + "?username=" + self.config.username + "&password=" + self.config.password
	if (self.config.debug) {
		console.log("State URL: ", stateURL);
	}
    setTimeout(function() {
	    http.request({
	        url: stateURL,
	        async: true,
	        contentType: "text/json",
	        timeout: 10000,
	        success: function (res) {
	            try {
	                var json = JSON.parse(res.data);
	                self.vDevs["insideTemp"].set("metrics:level", parseFloat(json.insideTemp));
	                self.vDevs["setPointTemp"].set("metrics:level", parseFloat(json.setPointTemp));
	            } catch (e) {
	                if (self.config.debug) {
	                    self.controller.addNotification("error", langFile.err_parse, "module", moduleName);
	                }
	            }
	        },
	        error: function () {
	            if (self.config.debug) {
	                self.controller.addNotification("error", langFile.err_fetch, "module", moduleName);
	            }
	        }
	    });
	}, 500);
    usersURL = TADO_USERS_URL + "?username=" + self.config.username + "&password=" + self.config.password
	if (self.config.debug) {
		console.log("Users URL: ", usersURL);
	}
	setTimeout(function() {
	    http.request({
	        url: usersURL,
	        async: true,
	        contentType: "text/json",
	        timeout: 10000,
	        success: function (res) {
	            try {
	                var json = JSON.parse(res.data);
	                for(n in json.appUsers) {
	                    user = json.appUsers[n];
	                    if( !("presence" + user.username in self.vDevs) ) {
	                        self.vDevs["presence" + user.username] = self.createUserDevice(self, user, n);
	                    }
	                    self.vDevs["presence" + user.username].set("metrics:level", user.relativePosition > json.geoMapScale["100"] ? "off" : "on");
	                }
	            } catch (e) {
	                if (self.config.debug) {
	                    self.controller.addNotification("error", langFile.err_parse, "module", moduleName);
	                }
	            }
	        },
	        error: function () {
	            if (self.config.debug) {
	                self.controller.addNotification("error", langFile.err_fetch, "module", moduleName);
	            }
	        }
	    });
	}, 500);
};

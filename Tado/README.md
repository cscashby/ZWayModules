#Tado

This module has been derived from the [JSONDevice](https://github.com/cscashby/ZWayModules/tree/master/JSONDevice) module.

The module connects to the Tado API (documented in various locations around the web.  Note that it currently uses the 1.4 version of the API, but 1.6 is current.  There are no obvious signs that this will be deprecated in the near future, but the author cannot guarantee this.

## Configuration

In the configuration screen the user has to specify the following parameters.  NOTE that the intention is to make these parameters more specific to Tado in the near future.  Watch this space!

* Check if data is numerical - should be Yes for this Tado device
* Check if data is floating point - should be Yes for this Tado device
* Full URL to JSON resource - this should have the username (email address) and password specified in the URL as follows:
`https://my.tado.com/mobile/1.4/getCurrentState?username=**USERNAME**&password=**PASSWORD**`
* \_\_jsonPath\_\_ - The JSON path used to get the temperature result from the JSON data (keep the default of `insideTemp`)
* Device refresh (minutes) - How regularly to grab the data from the Tado API
* Metric type - what to display for the name of the value in the UI
* Measurement units - what to display as units for the value in the UI (`C` as default)
* Device name - the name of the virtual device (`Tado` as default)

## Virtual Devices

The module creates a single virtual device named as configured, with a single multilevel sensor measurement value.

## Installation

Install the BaseModule from the App Store or https://github.com/maros/Zway-BaseModule first.

The prefered way of installing this module is via the "Zwave.me App Store" available in 2.2.0 and higher. For stable module releases no access token is required. For development releases, please contact the developer.

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

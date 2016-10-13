#Tado

The module connects to the Tado API (see References below).

Note that it currently uses the current 1.9 version of the API.  There are no obvious signs that this will be deprecated in the near future, but the author cannot guarantee this.

It also makes no assumptions as to the rate limiting, etc that may occur - use this module at your own risk! 

## Configuration

In the configuration screen the user has to specify the following parameters.

* Username/Password - the access details for your Tado account
* Device refresh (minutes) - How regularly to grab the data from the Tado API
* Device name - the name of the virtual device (`Tado` as default)

## Virtual Devices

The module creates the following virtual devices:
* Inside Temp - the temperature inside the house (on the Tado thermostat)
* Set Temp - the temperature set for the thermostat - read only for now, but watch this space!
* Presence - one device per user with On/Off status - On means the user is within the first circle of presence detection as shown on the My Tado 'target' graphic

## Installation

Install the BaseModule from the App Store or https://github.com/maros/Zway-BaseModule first.

The prefered way of installing this module is via the "Zwave.me App Store" available in 2.2.0 and higher. For stable module releases no access token is required. For development releases, please contact the developer.

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

# References / thanks

API format is wonderfully documented by Stephen Phillips, here: http://blog.scphillips.com/posts/2016/01/the-tado-api/

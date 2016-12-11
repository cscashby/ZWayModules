#ARPPresence

The module provides a presence device for a MAC address and therefore understand whether a given user is present or not.

Note that due to limitations of the Linux Kernel, it requires that the user has sudo access (edit /etc/sudoers) for the arping command.

## Configuration

In the configuration screen the user has to specify the following parameters.

* Device refresh (minutes) - How regularly to check for presence
* Device name - the name of the virtual device (`ARPUser` as default)
* MAC address - the MAC to check for on the network

## Virtual Devices

The module creates the following virtual devices:
* Inside Temp - the temperature inside the house (on the Tado thermostat)
* Set Temp - the temperature set for the thermostat - read only for now, but watch this space!
* Presence - one device per user with On/Off status - On means the user is within the first circle of presence detection as shown on the My Tado 'target' graphic

## Installation

Install the BaseModule from the App Store or https://github.com/maros/Zway-BaseModule first.

(note the below commands are for Debian/Raspbian/Ubuntu, other variants may have different syntax.

Install the arping command `sudo apt-get install arping`

Add the zway user to the sudoers file (/etc/sudoers):

~~~~
<username> ALL=(ALL) NOPASSWD: /usr/sbin/arping
~~~~

Add `sudo` to the `/opt/z-way-server/automation/.syscommands` file

The prefered way of installing this module is via the "Zwave.me App Store" available in x.x.x and higher (not currently available). For stable module releases no access token is required. For development releases, please contact the developer.

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.


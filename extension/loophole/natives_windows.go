/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package main

import (
	"net"
)

/**
* Does not create a specific dial context on windows
* the vpn client will use split tunneling to make sure the
* dialer is using the "real" network device :)
**/
func getDialer() net.Dialer {
	return net.Dialer{}
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "systemtrayhandler.h"
#include "logger.h"
#include "mozillavpn.h"

#include <QMenu>

namespace {
Logger logger(LOG_MAIN, "SystemTrayHandler");
}

SystemTrayHandler::SystemTrayHandler(const QIcon &icon, QObject *parent)
    : QSystemTrayIcon(icon, parent)
{   //% "Quit"
    m_menu.addAction(qtTrId("systray.quit"), this, &SystemTrayHandler::quit);
    setContextMenu(&m_menu);
}

void SystemTrayHandler::controllerStateChanged()
{
    logger.log() << "Show notification";

    if (!supportsMessages()) {
        return;
    }

    switch (MozillaVPN::instance()->controller()->state()) {
    case Controller::StateOn:
        //% "Mozilla VPN connected"
        showMessage(qtTrId("vpn.systray.statusConnected"), qtTrId("TODO"), NoIcon, 2000);
        break;

    case Controller::StateOff:
        //% "Mozilla VPN disconnected"
        showMessage(qtTrId("vpn.systray.statusDisconnected"), qtTrId("TODO"), NoIcon, 2000);
        break;

    case Controller::StateSwitching:
        //% "Mozilla VPN switching"
        //: This message is shown when the VPN is switching to a different server in a different location.
        showMessage(qtTrId("vpn.systray.statusSwitch"), qtTrId("TODO"), NoIcon, 2000);
        break;

    default:
        // Nothing to do.
        break;
    }
}

void SystemTrayHandler::captivePortalNotificationRequested()
{
    logger.log() << "Capitve portal notification shown";
    //% "Captive portal detected"
    showMessage(qtTrId("vpn.systray.captivePortalAlert"), tr("TODO"), NoIcon, 2000);
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import QtQuick 2.5
import QtQuick.Controls 2.14

import Mozilla.Shared 1.0
import components 0.1
import "qrc:/nebula/utils/MZUiUtils.js" as MZUiUtils

RadioDelegate {
    id: radioControl

    property bool isHoverable: true
    property var accessibleName: ""
    property var uiState: MZTheme.theme.uiState

    signal clicked()

    activeFocusOnTab: true

    Component.onCompleted: {
        state = uiState.stateDefault
    }

    onActiveFocusChanged: {
        if (!radioControl.activeFocus)
            return mouseArea.changeState(uiState.stateDefault);

        MZUiUtils.scrollToComponent(radioControl)
    }

    Keys.onPressed: event => {
        if (event.key === Qt.Key_Return || event.key === Qt.Key_Space)
            mouseArea.changeState(uiState.stateDefault);
    }

    Keys.onReleased: event => {
        if (event.key === Qt.Key_Return || event.key === Qt.Key_Space)
            radioControl.clicked();
    }

    Accessible.name: accessibleName
    Accessible.onPressAction: clicked()
    Accessible.focusable: true

    states: [
        State {
            name: uiState.statePressed

            PropertyChanges {
                target: radioButtonInsetCircle
                color: radioControl.checked ? MZTheme.theme.bluePressed : MZTheme.theme.greyPressed
                scale: 0.55
            }

            PropertyChanges {
                target: radioButton
                border.color: radioControl.checked? MZTheme.theme.bluePressed : MZTheme.theme.fontColorDark
            }

        },
        State {
            name: uiState.stateDefault

            PropertyChanges {
                target: radioButtonInsetCircle
                color: radioControl.checked ? MZTheme.theme.blue : MZTheme.theme.bgColor
                scale: 0.6
            }

            PropertyChanges {
                target: radioButton
                border.color: radioControl.checked || radioControl.activeFocus ? MZTheme.theme.blue : MZTheme.theme.fontColor
            }

        },
        State {
            name: uiState.stateHovered

            PropertyChanges {
                target: radioButtonInsetCircle
                color: radioControl.checked ? MZTheme.theme.bluePressed : MZTheme.theme.greyHovered
                scale: 0.6
            }

            PropertyChanges {
                target: radioButton
                border.color: radioControl.checked ? MZTheme.theme.bluePressed : MZTheme.theme.fontColor
            }

        }
    ]

    background: Rectangle {
        color: MZTheme.theme.transparent
    }

    MZMouseArea {
        id: mouseArea
    }

    indicator: Rectangle {
        id: radioButton

        anchors.left: parent.left
        implicitWidth: 20
        implicitHeight: 20
        radius: implicitWidth * 0.5
        border.width: MZTheme.theme.focusBorderWidth
        color: MZTheme.theme.bgColor
        antialiasing: true
        smooth: true

        Rectangle {
            id: radioButtonInsetCircle
            anchors.fill: parent
            radius: radioButton.implicitHeight / 2

            Behavior on color {
                ColorAnimation {
                    duration: 200
                }

            }

        }

        // Radio focus outline
        MZFocusOutline {
            focusedComponent: radioControl
            setMargins: -3
            radius: height / 2
        }

        Behavior on border.color {
            ColorAnimation {
                duration: 200
            }

        }

    }

}

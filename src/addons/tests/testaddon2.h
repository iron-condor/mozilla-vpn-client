/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include <QObject>
#include <QTest>

class SettingsHolder;

class TestAddon2 final : public QObject {
  Q_OBJECT

 private slots:
  void init();
  void cleanup();

  void message_notification_data();
  void message_notification();

 private:
  SettingsHolder* m_settingsHolder = nullptr;
};

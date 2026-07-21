import { ActionProviders } from "@core/base/action-providers";
import { SettingsFacade } from "./settings.facade";

export function settingsProviders(): any[] {
  return [
    ...ActionProviders(),
    SettingsFacade
  ];
}

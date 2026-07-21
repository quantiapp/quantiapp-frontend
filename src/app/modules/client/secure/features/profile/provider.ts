import { ActionProviders } from "@core/base/action-providers";
import { ProfileFacade } from "./profile.facade";

export function profileProviders(): any[] {
  return [
    ...ActionProviders(),
    ProfileFacade
  ];
}

import Service from '@ember/service';
import { ajax } from 'discourse/lib/ajax';
import { popupAjaxError } from "discourse/lib/ajax-error";

export default class BadgeExtensionService extends Service {

  async getGroupInformation(i) {
    try {
      let result = await ajax("/admin/badge_extension/group/" + i + ".json");
      return result.group;
    } catch (error) {
      popupAjaxError(error);
      return null;
    }
  }

  async getBadgeInformation(i) {
    try {
      let result = await ajax("/admin/badge_extension/badge/" + i + ".json");
      return result.badge;
    } catch (error) {
      popupAjaxError(error);
      return null;
    }
  }
  
  async pushGroupInformation(data) {
    const queryParams = new URLSearchParams(data).toString();
    const url = `/admin/badge_extension/save.json?${queryParams}`;

    try {
      await ajax({
        url: url,
        type: "POST",
        contentType: "application/json"
      });
    } catch (error) {
      throw error;
    }
    return true;
  }
}

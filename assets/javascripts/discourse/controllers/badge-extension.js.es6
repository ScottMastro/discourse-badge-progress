import Controller from '@ember/controller';
import { ajax } from 'discourse/lib/ajax';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class BadgeExtensionController extends Controller {
  @tracked isLoading = true;
  @tracked badgeGroups = null;

  init() {
    super.init(...arguments);
    this.loadBadgeGroups();
  }

  @action
  loadBadgeGroups() {
    ajax('/mybadges').then(data => {
      this.badgeGroups = data.badge_groups;
      this.isLoading = false;
    });
  }

  @action
  collectBadge(id){
    console.log(id)
  }
}

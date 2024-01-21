import Controller from '@ember/controller';
import { ajax } from 'discourse/lib/ajax';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

//todo: when not logged in?

export default class BadgeExtensionController extends Controller {
  @tracked isLoading = true;
  @tracked badgeGroups = null;
  @tracked goldCount = 0;
  @tracked silverCount = 0;
  @tracked bronzeCount = 0;

  @tracked currentBadge = null;

  @tracked bronzeCount = 0;


  init() {
    super.init(...arguments);
    this.loadBadgeGroups();

    //todo: reduce flickering by finding a better solution
    document.addEventListener('click', (event) => {
      console.log("click");
      this.currentBadge = null;
    });
  }
  
  @action
  loadBadgeGroups() {
    ajax('/mybadges').then(data => {
      ajax('/mybadges').then(data => {
        this.goldCount = data.gold_count;
        this.silverCount = data.silver_count;
        this.bronzeCount = data.bronze_count;
        this.badgeGroups = data.badge_groups;
        this.badgeGroups.sort((a, b) => a.position - b.position);
      }).catch(error => {
        console.error("Error loading badge groups:", error);
      }).finally(() => {
        this.isLoading = false;
      });
    });
  }
  

  @action
  collectBadge(id){
    console.log(id)
  }

  @action
  showPopup(badgeId) {
    ajax(`/user_badges.json?badge_id=${badgeId}`).then(data => {
      this.currentBadge = data.badges[0];
    }).catch(error => {
      console.error("Error showing popup:", error);
    });
  }

  @action
  favorite(badge) {
    //    return badge.favorite();
  }

}

import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { inject as controller } from "@ember/controller";

export default class AdminBadgesAdditionalSettings extends Component {
  @service router;
  @service siteSettings;
  @service badgeExtensionService;
  @controller adminBadges;
  @tracked currentBadgeId=null;
  @tracked showOnProgressPage=false;
  @tracked isQuantitative=false;
  @tracked progressQuery="";
  @tracked saving=false;
  @tracked savingStatus="";
  @tracked currentGroupId=null;
  @tracked allowClaim=false;
  @tracked showEarned=false;
  @tracked badgeRequirement;

  get badgeGroupings() {
    return this.adminBadges.badgeGroupings;
  }

  // this is a bit of a hack to respond to when the badge route changes
  // this getter is triggered by the hidden div in the hbs file
  // when the route changes, and reloads the badge data
  get currentRouteWatcher() {
    this.loadBadgeData();
    return this.router.currentURL;
  }

  loadBadgeData() {
    let badge_id = this.router.currentRoute.params.badge_id;
    if (badge_id){
      this.currentBadgeId = badge_id;
    }

    this.badgeExtensionService.getBadgeInformation(this.currentBadgeId)
    .then(badge => {
      if(badge){
        this.badgeRequirement = badge.requirement;
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  @action
  save() {

    if (!this.saving) {
      this.saving = true;
      this.savingStatus = I18n.t("saving");

      const data = {};
      data["group_id"] = this.currentGroupId;
      data["badge_id"] = this.currentBadgeId;

      if (this.currentGroupId){
        data["show_progress"] = this.showOnProgressPage;
        data["is_quantitative"] = this.isQuantitative;
        data["progress_query"] = this.progressQuery
      }
      data["allow_claim"] = this.allowClaim
      data["requirement"] = this.badgeRequirement
      data["show_earned"] = this.showEarned

      console.log(data)
      
      this.badgeExtensionService.pushGroupInformation(data)
      .then(() => { 
        setTimeout(() => {
          this.saving = false;
          this.savingStatus = "";
        }, 100);
       })
      .catch(error => {
        console.error(error);
      });
    }
  }

  @action
  updateBadgeGroupId(groupId) {
    this.currentGroupId = groupId;

    this.badgeExtensionService.getGroupInformation(groupId)
    .then(group => {
      if(group){
        this.showOnProgressPage = group.show_progress;
        this.isQuantitative = group.is_quantitative;
        this.progressQuery = group.progress_query;
      }
    })
    .catch(error => {
      console.error(error);
    });

    this.saving = false;
    this.savingStatus = "";

  }
  
}
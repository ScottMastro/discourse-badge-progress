import Controller from '@ember/controller';
import { ajax } from 'discourse/lib/ajax';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

//todo: when not logged in?

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
      scheduleOnce('afterRender', this, this.attachSparkleListeners);
    });
  }
  
  attachSparkleListeners() {
    var spriteContainers = document.querySelectorAll('.sparkle-effect');
    var animationDuration = 100;

    spriteContainers.forEach(function(spriteContainer) {
      spriteContainer.addEventListener('mouseenter', function() {
        spriteContainer.classList.add('animate-sparkle');
      });

      spriteContainer.addEventListener('animationend', function() {
        setTimeout(function() {
          spriteContainer.classList.remove('animate-sparkle');
        }, animationDuration);
      });
    });
  }

  @action
  collectBadge(id){
    console.log(id)
  }
}

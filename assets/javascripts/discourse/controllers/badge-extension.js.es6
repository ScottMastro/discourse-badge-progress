import Controller from '@ember/controller';
import { ajax } from 'discourse/lib/ajax';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

//todo: when not logged in?

export default class BadgeExtensionController extends Controller {
  @tracked isLoading = true;
  @tracked badgeGroups = null;
  @tracked goldCount = 0;
  @tracked silverCount = 0;
  @tracked bronzeCount = 0;

  init() {
    super.init(...arguments);
    this.loadBadgeGroups();
  }

  
  @action
  loadBadgeGroups() {
    ajax('/mybadges').then(data => {
      this.goldCount = data.gold_count;
      this.silverCount = data.silver_count;
      this.bronzeCount = data.bronze_count;

      this.badgeGroups = data.badge_groups;
      this.badgeGroups.sort((a, b) => a.position - b.position);

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

import DiscourseRoute from 'discourse/routes/discourse';

export default DiscourseRoute.extend({
  model() {
    return Ember.$.getJSON('/mybadges.json');
  },

  setupController(controller, model) {
    controller.setProperties({
      userBadges: model.user_badges,
      allBadges: model.all_badges
    });
  },
});

# frozen_string_literal: true

class BadgeExtension::BadgeExtensionController < ::ApplicationController
  def index
    user_badges = current_user.badges
    all_badges = Badge.all

    render json: { user_badges: user_badges, all_badges: all_badges }
  end
end

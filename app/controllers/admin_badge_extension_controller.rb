# frozen_string_literal: true

class BadgeExtension::AdminBadgeExtensionController < ::ApplicationController
  def index
    
    user_badges = current_user.badges
    all_badges = Badge.all

    render json: { user_badges: user_badges, all_badges: all_badges }
  end

  def get_group_info
    group_id = params[:group_id]
    group = BadgeGrouping.find_by(id: group_id)
    render json: { "group": group, }
  end

  def get_badge_info
    badge_id = params[:badge_id]
    badge = Badge.find_by(id: badge_id)
    render json: { "badge": badge, }
  end


  def save
    success=true

    # Process the group data
    group_id = params[:group_id]
    show_progress = params[:show_progress]
    is_quantitative = params[:is_quantitative]
    progress_query = params[:progress_query]
    allow_claim = params[:allow_claim]
    
    group = BadgeGrouping.find_by(id: group_id)

    if group.present?
      group.update(
        show_progress: show_progress,
        is_quantitative: is_quantitative,
        progress_query: progress_query)
    else
      success=false
    end

    # Process the badge data
    badge_id = params[:badge_id]
    requirement = params[:requirement]

    badge = Badge.find_by(id: badge_id)

    if badge.present?
      badge.update(
        requirement: requirement)
    else
      success=false
    end

    render json: { "success": success }

  end


end

